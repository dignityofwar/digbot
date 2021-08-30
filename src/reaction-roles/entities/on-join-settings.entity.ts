import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity({tableName: 'reaction_roles_on_join_settings'})
export class OnJoinSettings {
    constructor(data: Omit<OnJoinSettings, 'id' | 'createdAt' | 'updatedAt'>) {
        Object.assign(this, data);
    }

    @PrimaryKey()
    readonly id: number;

    @Property()
    guildId: string;

    @Property({columnType: 'text'})
    description: string;

    @Property()
    expireDelay: number;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt: Date = new Date();

    @Property()
    readonly createdAt: Date = new Date();
}