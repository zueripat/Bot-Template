import { Command } from '../lib/schema';
import { ChatInputCommandInteraction } from 'discord.js';

const pingCommand: Command<ChatInputCommandInteraction> = {
    global: false,
    data: {
        name: 'ping',
        description: 'Replies with pong!',
    },
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};

export default pingCommand;
