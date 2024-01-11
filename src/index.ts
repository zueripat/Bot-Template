import { Bot } from './lib/bot';

const discordToken = process.env.DISCORD_TOKEN as string;
const client = new Bot({ intents: ['Guilds'] });

void client.login(discordToken);
