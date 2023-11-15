import { Command } from '../lib/schema';
import { SlashCommandBuilder } from 'discord.js';

const pingCommand: Command = {
    global: false,
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};

export default pingCommand;
