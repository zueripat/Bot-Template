import { Bot } from './util/bot';

const discordToken = process.env.DISCORD_TOKEN as string;
const client = new Bot({ intents: ['Guilds'] });

void client.login(discordToken);
