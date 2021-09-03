import {PrimaryKey, Property} from '@mikro-orm/core';

export abstract class BaseEntity {
    @PrimaryKey()
    readonly id: number;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt = new Date();

    @Property()
    readonly createdAt = new Date();
}
