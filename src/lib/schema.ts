import {
    AutocompleteInteraction,
    ClientEvents,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ModalSubmitInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import { DC } from './discord';

export type Command = {
    global?: boolean;
    customId?: string;
    data: SlashCommandBuilder | ContextMenuCommandBuilder;
    execute: (interaction: CommandInteraction, client: DC) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction, client: DC) => Promise<void>;
    submit?: (interaction: ModalSubmitInteraction, client: DC) => Promise<void>;
};

export type Event = {
    once?: boolean;
    name: keyof ClientEvents;
    execute: (...args: any[]) => Promise<void>;
};
