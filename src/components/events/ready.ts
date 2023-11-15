import { Event } from '../../lib/schema';
import { logger } from '../../lib/logging';

const log = logger.child({ class: 'Ready' });

const event: Event = {
    name: 'ready',
    once: true,
    async execute(client) {
        log.info(`Logged in as ${client.user?.tag}!`);
    },
};

export default event;
