import type { API } from '@discordjs/core';
import type {
    APIApplicationCommandBooleanOption,
    APIChatInputApplicationCommandInteraction,
} from 'discord-api-types/v10';
import { MessageFlags } from 'discord-api-types/v10';
import type { Bot } from '../util/bot';

// Ping command execution
export async function pingCommand(interaction: APIChatInputApplicationCommandInteraction, api: API, client: Bot) {
    const { options } = interaction.data;
    const hide = options?.find((option) => option.name === 'hide') as APIApplicationCommandBooleanOption | undefined;

    // Send a reply to the interaction
    await api.interactions.reply(interaction.id, interaction.token, {
        content: 'Pong!',
        flags: hide ? MessageFlags.Ephemeral : undefined,
    });
}
