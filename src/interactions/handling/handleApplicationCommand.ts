import type { API } from '@discordjs/core';
import type {
    APIApplicationCommandInteraction,
    APIChatInputApplicationCommandInteraction,
} from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { pingCommand } from '../../functions/ping.js';
import type { Bot } from '../../util/bot.js';

export async function handleApplicationCommand(interaction: APIApplicationCommandInteraction, api: API, client: Bot) {
    const { data, id, token } = interaction;
    const { name, type } = data;

    switch (type) {
        case ApplicationCommandType.ChatInput:
            switch (name) {
                case 'ping':
                    await pingCommand(interaction as APIChatInputApplicationCommandInteraction, api, client);
                    break;
            }

            break;
        case ApplicationCommandType.User:
        case ApplicationCommandType.Message:
            switch (name) {
            }

            break;
    }
}
