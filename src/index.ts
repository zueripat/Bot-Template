import { DC } from './lib/discord';

const discordToken = process.env.DISCORD_TOKEN as string;
const client = new DC({ intents: ['Guilds'] });

async function main(): Promise<void> {
    await client.login(discordToken);
}

main().finally(() => client.prisma.$disconnect());
