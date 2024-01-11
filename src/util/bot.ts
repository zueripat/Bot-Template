import {
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    ClientOptions,
    Collection,
    ContextMenuCommandInteraction,
    REST,
    Routes,
    Snowflake,
} from 'discord.js';
import { logger } from './logging';
import { Command, Event } from './schema';
import { join } from 'path';
import { readdir } from 'fs/promises';
import { PrismaClient } from '@prisma/client';

export class Bot extends Client {
    public readonly prisma: PrismaClient;
    public cooldowns = new Collection<Snowflake, Collection<Snowflake, number>>();

    private commands = new Collection<string, Command<any>>();
    private events = new Collection<string, Event<any>>();

    constructor(options: ClientOptions) {
        super(options);
        this.prisma = new PrismaClient();

        logger.info('Initializing Discord Client');
    }

    private async init(token: string): Promise<void> {
        await this.loadCommands();
        await this.loadEvents();

        const rest = new REST({ version: '10' }).setToken(token);
        const applicationClientID = process.env.DISCORD_CLIENT_ID! as Snowflake;
        const applicationDevGuildID = process.env.DISCORD_DEVGUILD_ID! as Snowflake;

        try {
            logger.info('Started refreshing application (/) commands.');
            const globalCommands = this.commands.filter((command) => command.global);
            const guildCommands = this.commands.filter((command) => !command.global);

            if (applicationClientID) {
                if (applicationDevGuildID) {
                    await rest.put(Routes.applicationGuildCommands(applicationClientID, applicationDevGuildID), {
                        body: guildCommands.map((command) => command.data),
                    });
                } else {
                    logger.warn('No guild ID provided, not reloading guild (/) commands.');
                }

                await rest.put(Routes.applicationCommands(applicationClientID), {
                    body: globalCommands.map((command) => command.data),
                });
                logger.info('Successfully reloaded application (/) commands.');
            } else {
                logger.warn('No client ID provided, not reloading (/) commands.');
            }
        } catch (error) {
            logger.info('Failed to reload application (/) commands.');
            logger.error(error);
        }
    }

    private async loadCommands(): Promise<void> {
        const commandFiles = await readdir(join(__dirname, '../commands'));
        for (const file of commandFiles) {
            const command = (await import(join(__dirname, '../commands', file))) as {
                default: Command<ChatInputCommandInteraction | ContextMenuCommandInteraction>;
            };
            logger.info(`Loading command ${command.default.data.name}`);

            this.commands.set(command.default.data.name!, command.default);
            this.on('interactionCreate', async (interaction) => {
                switch (true) {
                    case interaction.isChatInputCommand() || interaction.isContextMenuCommand():
                        if (interaction.commandName === command.default.data.name) {
                            await command.default.execute(interaction, this);
                        }
                        break;
                    case interaction.isAutocomplete():
                        if (interaction.commandName === command.default.data.name && command.default.autocomplete) {
                            await command.default.autocomplete(interaction, this);
                        }
                        break;
                    default:
                        logger.info(`An unexpected situation occured 🚔`);
                }
            });
        }
    }

    private async loadEvents(): Promise<void> {
        const eventFiles = await readdir(join(__dirname, '../events'));
        for (const file of eventFiles) {
            const event = (await import(join(__dirname, '../events', file))) as { default: Event<keyof ClientEvents> };
            logger.info(`Loading event ${event.default.name}`);
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

    /* --------------------------------------------------------- */

    // Helper function to calculate Levenshtein Distance
    private levenshtein(a: string, b: string): number {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix: number[][] = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a[j - 1] === b[i - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
            }
        }
        return matrix[b.length][a.length];
    }

    // Helper function to calculate accuracy from steps
    private isSimilar(a: string, b: string): boolean {
        const similarity: number = (1 - this.levenshtein(a, b) / Math.max(a.length, b.length)) * 100;
        return similarity >= 80;
    }

    // Helper function to create a Hash Map of keywords
    private mapKeywords(datasets: Set<Set<string>>): Map<string, string[]> {
        const keywordsMap: Map<string, string[]> = new Map();
        for (const dataset of datasets) {
            for (const data of dataset) {
                const keyWords = data.toLowerCase().split(/[\s-]+/);
                for (const word of keyWords) {
                    if (!keywordsMap.has(word)) {
                        keywordsMap.set(word, []);
                    }
                    keywordsMap.get(word)?.push(data);
                }
            }
        }
        return keywordsMap;
    }

    public findMatchingKeywords(message: string, datasets: Set<Set<string>>): string[] {
        const keywordsMap = this.mapKeywords(datasets);
        const words = message.toLowerCase().split(/[\s-]+/);
        const matches = new Set<string>();

        for (const [index, word] of words.entries()) {
            if (keywordsMap.has(word)) {
                for (const keyword of keywordsMap.get(word)!) {
                    const keywordWords = keyword.split(/[\s-]+/);
                    const messageSegment = words.slice(index, index + keywordWords.length).join(' ');

                    if (messageSegment === keyword.toLowerCase() || this.isSimilar(keyword.toLowerCase(), messageSegment)) {
                        matches.add(keyword);
                    }
                }
            }
        }

        return Array.from(matches);
    }
}
