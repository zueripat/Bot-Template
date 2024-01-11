import { Event } from '../lib/schema';
import { logger } from '../lib/logging';
import { Events } from 'discord.js';

const readyEvent: Event<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as ${client.user?.tag}!`);
    },
};

export default readyEvent;
