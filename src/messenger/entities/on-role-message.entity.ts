import {Entity, Index, PrimaryKey, Property, Unique} from '@mikro-orm/core';

@Entity({tableName: 'messenger_role'})
@Unique({properties: ['roleId', 'channelId']})
export class OnRoleMessage {
    constructor(data: Omit<OnRoleMessage, 'id' | 'createdAt' | 'updatedAt'>) {
        Object.assign(this, data);
    }

    @PrimaryKey()
    readonly id: number;

    @Property()
    @Index()
    guildId: string;

    @Property()
    @Index()
    roleId: string;

    @Property()
    channelId?: string;

    @Property({columnType: 'text'})
    message: string;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt = new Date();

    @Property()
    readonly createdAt = new Date();
}
