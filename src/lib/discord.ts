import {
    Client,
    ClientOptions,
    Collection,
    Routes,
    CommandInteraction,
    AutocompleteInteraction,
    ModalSubmitInteraction,
    ClientEvents,
    REST,
} from 'discord.js';
import { logger } from './logging';
import { Command, Event } from './schema';

import { join } from 'path';
import { readdir } from 'fs/promises';
import { PrismaClient } from '@prisma/client';

class DC extends Client {
    private logger = logger.child({ class: 'DC' });
    private commands: Collection<string, Command> = new Collection();
    private events: Collection<keyof ClientEvents, Event> = new Collection();
    public prisma: PrismaClient;

    constructor(options: ClientOptions) {
        super(options);
        this.prisma = new PrismaClient();
        this.logger.info('Initializing Discord Client');
    }

    private async init(token: string): Promise<void> {
        await this.loadCommands();
        await this.loadEvents();

        const rest = new REST({ version: '10' }).setToken(token);
        try {
            this.logger.info('Started refreshing application (/) commands.');

            if (process.env.GUILD_ID && this.user) {
                const guildCommands = this.commands.filter((command) => !command.global);
                await rest.put(Routes.applicationGuildCommands(this.user.id, process.env.GUILD_ID), {
                    body: guildCommands.map((command) => command.data.toJSON()),
                });

                const globalCommands = this.commands.filter((command) => command.global);
                await rest.put(Routes.applicationCommands(this.user.id), {
                    body: globalCommands.map((command) => command.data.toJSON()),
                });
            }

            this.logger.info('Successfully reloaded application (/) commands.');
        } catch (error) {
            this.logger.error('Failed to reload application (/) commands.', error);
        }
    }

    private async loadCommands(): Promise<void> {
        const commandFiles = await readdir(join(__dirname, '../components/commands'));
        for (const file of commandFiles) {
            const command = (await import(join(__dirname, '../components/commands', file))) as { default: Command };
            this.logger.info(`Loading command ${command.default.data.name}`);
            this.commands.set(command.default.data.name, command.default);

            this.on('interactionCreate', async (interaction) => {
                switch (true) {
                    case interaction.isChatInputCommand() || interaction.isContextMenuCommand():
                        const commandInteraction = interaction as CommandInteraction;
                        await command.default.execute(commandInteraction, this);
                        break;
                    case interaction.isAutocomplete():
                        const autocompleteInteraction = interaction as AutocompleteInteraction;
                        if (autocompleteInteraction.commandName === command.default.data.name && command.default.autocomplete) {
                            await command.default.autocomplete(autocompleteInteraction, this);
                        }
                        break;
                    case interaction.isModalSubmit():
                        const modalSubmitInteraction = interaction as ModalSubmitInteraction;
                        if (modalSubmitInteraction.customId === command.default.customId && command.default.submit) {
                            await command.default.submit(modalSubmitInteraction, this);
                        }
                }
            });
        }
    }

    private async loadEvents(): Promise<void> {
        const eventFiles = await readdir(join(__dirname, '../components/events'));
        for (const file of eventFiles) {
            const event = (await import(join(__dirname, '../components/events', file))) as { default: Event };
            this.logger.info(`Loading event ${event.default.name}`);
            this.events.set(event.default.name, event.default);

            if (event.default.once) {
                this.once(event.default.name, (...args) => event.default.execute(...args));
            } else {
                this.on(event.default.name, (...args) => event.default.execute(...args));
            }
        }
    }

    public async login(token: string): Promise<string> {
        await this.init(token);
        return super.login(token);
    }
}

export { DC };
