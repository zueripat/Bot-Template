import { DISCORD_GUILD_ID, DISCORD_CLIENT_ID, DISCORD_TOKEN } from '../../util/config.js';
import { API_BASE_DISCORD } from '../../util/constants.js';
import { logger } from '../../util/logging.js';

export async function deploy(data: any, dev = false) {
    const midRoute = dev ? `/guilds/${DISCORD_GUILD_ID}` : '';
    const route = `${API_BASE_DISCORD}/applications/${DISCORD_CLIENT_ID}${midRoute}/commands`;

    try {
        logger.info(`Starting update on route ${route}`);
        const res = await fetch(route, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${DISCORD_TOKEN}`,
            },
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(async (response) => response.json());
        logger.info(res as string);
        logger.info('Update completed');
    } catch (error) {
        logger.info('Request failed:');
        logger.error(error as Error);
    }
}
