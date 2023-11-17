import { Event } from '../lib/schema';
import { Events } from 'discord.js';
import { logger } from '../lib/logging';

const log = logger.child({ class: 'Ready' });

const event: Event<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        log.info(`Logged in as ${client.user?.tag}!`);
    },
};

export default event;
