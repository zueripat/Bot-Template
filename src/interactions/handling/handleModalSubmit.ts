import type { API } from '@discordjs/core';
import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { Bot } from '../../util/bot.js';

export async function handleModalSubmit(interaction: APIModalSubmitInteraction, api: API, client: Bot) {
    const { data, id, token } = interaction;
    const { custom_id } = data;

    switch (custom_id) {
    }
}
