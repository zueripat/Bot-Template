import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const PingCommand: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide command output',
            required: false,
        },
    ],
};
