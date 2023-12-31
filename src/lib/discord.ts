import {
    AutocompleteInteraction,
    Client,
    ClientEvents,
    ClientOptions,
    Collection,
    ContextMenuCommandBuilder,
    ModalSubmitInteraction,
    REST,
    Routes,
    SlashCommandBuilder,
} from 'discord.js';
import { logger } from './logging';
import { Command, CommandInteractionType, Event } from './schema';

import { join } from 'path';
import { readdir } from 'fs/promises';
import { PrismaClient } from '@prisma/client';

class DC extends Client {
    private logger = logger.child({ class: 'DC' });
    private commands: Collection<string, Command<SlashCommandBuilder | ContextMenuCommandBuilder>> = new Collection();
    private events: Collection<keyof ClientEvents, Event<keyof ClientEvents>> = new Collection();
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
        const clientID = process.env.DISCORD_CLIENT_ID;
        const guildID = process.env.DISCORD_GUILD_ID;

        try {
            this.logger.info('Started refreshing application (/) commands.');
            const globalCommands = this.commands.filter((command) => command.global);
            const guildCommands = this.commands.filter((command) => !command.global);

            if (clientID) {
                if (guildID) {
                    await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
                        body: guildCommands.map((command) => command.data.toJSON()),
                    });
                } else {
                    this.logger.warn('No guild ID provided, not reloading guild (/) commands.');
                }

                await rest.put(Routes.applicationCommands(clientID), {
                    body: globalCommands.map((command) => command.data.toJSON()),
                });
                this.logger.info('Successfully reloaded application (/) commands.');
            } else {
                this.logger.warn('No client ID provided, not reloading (/) commands.');
            }
        } catch (error) {
            this.logger.error('Failed to reload application (/) commands.', error);
        }
    }

    private async loadCommands(): Promise<void> {
        const commandFiles = await readdir(join(__dirname, '../commands'));
        for (const file of commandFiles) {
            const command = (await import(join(__dirname, '../commands', file))) as {
                default: Command<SlashCommandBuilder | ContextMenuCommandBuilder>;
            };
            this.logger.info(`Loading command ${command.default.data.name}`);
            this.commands.set(command.default.data.name, command.default);

            this.on('interactionCreate', async (interaction) => {
                switch (true) {
                    case interaction.isChatInputCommand() || interaction.isContextMenuCommand():
                        const commandInteraction = interaction as CommandInteractionType<
                            SlashCommandBuilder | ContextMenuCommandBuilder
                        >;
                        await command.default.execute(commandInteraction, this);
                        break;
                    case interaction.isAutocomplete():
                        const autocompleteInteraction = interaction as AutocompleteInteraction;
                        if (
                            autocompleteInteraction.commandName === command.default.data.name &&
                            command.default.autocomplete
                        ) {
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
        const eventFiles = await readdir(join(__dirname, '../events'));
        for (const file of eventFiles) {
            const event = (await import(join(__dirname, '../events', file))) as { default: Event<keyof ClientEvents> };
            this.logger.info(`Loading event ${event.default.name}`);
            this.events.set(event.default.name, event.default);

            if (event.default.once) {
                this.once(event.default.name, (...args) => event.default.execute(this, ...args));
            } else {
                this.on(event.default.name, (...args) => event.default.execute(this, ...args));
            }
        }
    }

    public async login(token: string): Promise<string> {
        await this.init(token);
        return super.login(token);
    }
}

export { DC };
