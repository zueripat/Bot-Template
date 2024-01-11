import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

const DATABASE_URL = process.env.DATABASE_URL;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

switch (true) {
    case !DATABASE_URL:
        throw new Error('DATABASE_URL not set in environment');
    case !DISCORD_TOKEN:
        throw new Error('DISCORD_TOKEN not set in environment');
    case !DISCORD_GUILD_ID:
        throw new Error('DISCORD_GUILD_ID not set in environment');
    case !DISCORD_CLIENT_ID:
        throw new Error('DISCORD_CLIENT_ID not set in environment');
}

export { DATABASE_URL, DISCORD_TOKEN, DISCORD_GUILD_ID, DISCORD_CLIENT_ID };
