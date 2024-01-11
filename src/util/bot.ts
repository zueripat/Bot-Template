import { Client, API } from '@discordjs/core';
import type { REST } from '@discordjs/rest';
import type { WebSocketManager } from '@discordjs/ws';
import { PrismaClient } from '@prisma/client';
import { GatewayDispatchEvents, InteractionType } from 'discord-api-types/v10';
import { handleApplicationCommand } from '../interactions/handling/handleApplicationCommand.js';
import { handleApplicationCommandAutocomplete } from '../interactions/handling/handleApplicationCommandAutocomplete.js';
import { handleComponent } from '../interactions/handling/handleComponents.js';
import { handleModalSubmit } from '../interactions/handling/handleModalSubmit.js';
import { logger } from './logging.js';

export class Bot extends Client {
    public readonly api: API;

    public readonly db: PrismaClient;

    constructor({ rest, gateway }: { gateway: WebSocketManager; rest: REST }) {
        super({ rest, gateway });
        logger.info('Initializing Discord Client');

        this.api = new API(rest);
        this.db = new PrismaClient();

        // Initialize event handlers
        this.GatewayDispatchEventHandler();
    }

    private GatewayDispatchEventHandler() {
        logger.info('Initializing Gateway Dispatch Event Handler');

        this.on(GatewayDispatchEvents.InteractionCreate, async ({ data, api }) => {
            switch (data.type) {
                case InteractionType.Ping:
                    break;
                case InteractionType.ApplicationCommand:
                    await handleApplicationCommand(data, api, this);
                    break;
                case InteractionType.ApplicationCommandAutocomplete:
                    await handleApplicationCommandAutocomplete(data, api, this);
                    break;
                case InteractionType.MessageComponent:
                    await handleComponent(data, api, this);
                    break;
                case InteractionType.ModalSubmit:
                    await handleModalSubmit(data, api, this);
                    break;
            }
        });
    }
}
