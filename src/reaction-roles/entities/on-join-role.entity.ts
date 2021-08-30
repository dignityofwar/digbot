import {Entity, Index, PrimaryKey, Property, Unique} from '@mikro-orm/core';

@Entity({tableName: 'reaction_roles_on_join'})
@Unique({properties: ['guildId', 'emojiName', 'emojiId']})
export class OnJoinRole {
    constructor(data: Omit<OnJoinRole, 'id' | 'createdAt' | 'updatedAt'>) {
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
    emojiName: string;

    @Property()
    emojiId?: string;

    @Property()
    isAnimated: boolean;

    @Property()
    name: string;

    @Property()
    order: number;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt = new Date();

    @Property()
    readonly createdAt = new Date();
}
