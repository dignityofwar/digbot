import {PrimaryKey, Property} from '@mikro-orm/core';

export abstract class BaseEntity {
    // constructor(data: Omit<, 'id' | 'createdAt' | 'updatedAt'>) {
    //     Object.assign(this, data);
    // }

    @PrimaryKey()
    readonly id: number;

    @Property({onUpdate: () => new Date()})
    readonly updatedAt = new Date();

    @Property()
    readonly createdAt = new Date();
}
