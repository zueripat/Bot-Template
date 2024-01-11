import {
    ChatInputCommandInteraction,
    ClientEvents,
    ContextMenuCommandInteraction,
    Events,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';
import { Bot } from './bot';

export interface Command<Interaction extends ChatInputCommandInteraction | ContextMenuCommandInteraction> {
    global?: boolean
    data: Interaction extends ChatInputCommandInteraction
        ? RESTPostAPIChatInputApplicationCommandsJSONBody
        : RESTPostAPIContextMenuApplicationCommandsJSONBody
}

export type Event<Event extends keyof ClientEvents> = {
    once?: boolean
    cooldown?: number
    name: Event
    execute: (client: Bot, ...args: ClientEvents[Event]) => Promise<void>
};

export { Events };
