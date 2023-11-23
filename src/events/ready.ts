import { Event } from '../lib/schema';
import { logger } from '../lib/logging';

import { Events } from 'discord.js';

const log = logger.child({ class: 'Ready' });

const event: Event<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        log.info(`Logged in as ${client.user?.tag}!`);
    },
};

export default event;
