import Handler from '../Handler';
import { Client } from 'discord.js';
import { EntityManager } from 'typeorm';

export default class RoleManager extends Handler {
    public constructor(
        private readonly manager: EntityManager,
    ) {
        super();
    }

    public up(client: Client): void {
    }


}
