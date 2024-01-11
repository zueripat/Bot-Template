import { GatewayIntentBits } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { Bot } from './util/bot.js';
import { DISCORD_TOKEN } from './util/config.js';
import { GatewayDispatchEvents } from 'discord-api-types/v10';
import { logger } from './util/logging.js';

// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN!);

const gateway = new WebSocketManager({
    token: DISCORD_TOKEN!,
    intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
    rest,
});

const client = new Bot({ rest, gateway });

client.once(GatewayDispatchEvents.Ready, (event) => {
    const { username, discriminator } = event.data.user;
    logger.info(`Logged in! ${username}#${discriminator}`);
});

void gateway.connect();
