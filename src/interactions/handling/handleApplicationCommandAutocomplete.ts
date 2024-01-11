import type { API } from '@discordjs/core';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import type { Bot } from '../../util/bot.js';

export async function handleApplicationCommandAutocomplete(
    interaction: APIApplicationCommandAutocompleteInteraction,
    api: API,
    client: Bot,
) {
    const { data, id, token } = interaction;
    const { name } = data;

    switch (name) {
    }
}
