import { PingCommand } from '../../interactions/ping.js';
import { deploy } from './deploy.js';

void deploy(
    [PingCommand].map((interaction) => ({
        ...interaction,
        description: `🛠️ ${interaction.description}`,
    })),
    true,
);
