import {Entity, Index, PrimaryKey, Property, Unique} from '@mikro-orm/core';

@Entity({tableName: 'messenger_boost'})
@Unique({properties: ['guildId', 'channelId']})
export class OnBoostMessage {
    constructor(data: Omit<OnBoostMessage, 'id' | 'createdAt' | 'updatedAt'>) {
        Object.assign(this, data);
    }

    @PrimaryKey()
    readonly id: number;

    @Property()
    @Index()
    guildId: string;

    @Property()
    channelId?: string;

    @Property({columnType: 'text'})
    message: string;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt = new Date();

    @Property()
    readonly createdAt = new Date();
}
