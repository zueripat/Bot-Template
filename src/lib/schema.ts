import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    ContextMenuCommandInteraction,
    Events,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';
import { Bot } from './bot';

export type CommandData<TInteraction> = TInteraction extends ChatInputCommandInteraction
    ? RESTPostAPIChatInputApplicationCommandsJSONBody
    : RESTPostAPIContextMenuApplicationCommandsJSONBody;

export type Command<TInteraction extends ChatInputCommandInteraction | ContextMenuCommandInteraction> = {
    global?: boolean;
    cooldown?: number;
    data: CommandData<TInteraction>;
    execute: (interaction: TInteraction, client: Bot) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction, client: Bot) => Promise<void>;
};

export type Event<T extends keyof ClientEvents> = {
    once?: boolean;
    name: T;
    execute: (client: Bot, ...args: ClientEvents[T]) => Promise<void>;
};

export { Events };
