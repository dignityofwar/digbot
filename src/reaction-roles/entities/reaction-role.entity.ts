import {Entity, Index, PrimaryKey, Property, Unique} from '@mikro-orm/core';

@Entity({tableName: 'reaction_roles'})
@Unique({properties: ['messageId', 'emojiName', 'emojiId']})
export class ReactionRole {
    constructor(data: Omit<ReactionRole, 'id' | 'createdAt' | 'updatedAt'>) {
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
    channelId: string;

    @Property()
    @Index()
    messageId: string;

    @Property()
    emojiName: string;

    @Property()
    emojiId?: string;

    @Property()
    @Index()
    expireAt?: Date;

    @Property()
    referenceType: string;

    @Property()
    referenceId?: string;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt: Date = new Date();

    @Property()
    readonly createdAt: Date = new Date();
}
