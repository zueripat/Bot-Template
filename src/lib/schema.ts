import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import { DC } from './discord';

export type CommandInteractionType<T> = T extends SlashCommandBuilder
    ? ChatInputCommandInteraction
    : T extends ContextMenuCommandBuilder
      ? ContextMenuCommandInteraction
      : never;

export type CommandData<T> = T extends SlashCommandBuilder
    ? Omit<
          SlashCommandBuilder,
          | 'addSubcommand'
          | 'addSubcommandGroup'
          | 'addStringOption'
          | 'addIntegerOption'
          | 'addBooleanOption'
          | 'addUserOption'
          | 'addChannelOption'
          | 'addRoleOption'
          | 'addMentionableOption'
          | 'addNumberOption'
          | 'addAttachmentOption'
      > &
          Partial<
              Pick<
                  SlashCommandBuilder,
                  | 'addSubcommand'
                  | 'addSubcommandGroup'
                  | 'addStringOption'
                  | 'addIntegerOption'
                  | 'addBooleanOption'
                  | 'addUserOption'
                  | 'addChannelOption'
                  | 'addRoleOption'
                  | 'addMentionableOption'
                  | 'addNumberOption'
                  | 'addAttachmentOption'
              >
          >
    : T extends ContextMenuCommandBuilder
      ? ContextMenuCommandBuilder
      : never;

export type Command<T extends SlashCommandBuilder | ContextMenuCommandBuilder> = {
    global?: boolean;
    customId?: string;
    data: CommandData<T>;
    execute: (interaction: CommandInteractionType<T>, client: DC) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction, client: DC) => Promise<void>;
    submit?: (interaction: ModalSubmitInteraction, client: DC) => Promise<void>;
};

export type Event<T extends keyof ClientEvents> = {
    once?: boolean;
    name: T;
    execute: (client: DC, ...args: ClientEvents[T]) => Promise<void>;
};
