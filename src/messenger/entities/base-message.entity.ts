import {ManyToOne, PrimaryKey, Property} from '@mikro-orm/core';
import {CreatedAt, UpdatedAt} from '../../database/decorators/date.decorators';
import {Guild} from '../../discord/entities/guild.entity';
import {Channel} from '../../discord/entities/channel.entity';

export abstract class BaseMessage {
    @PrimaryKey()
    readonly id: number;

    @ManyToOne()
    guild: Guild;

    @ManyToOne()
    channel?: Channel;

    @Property({columnType: 'text'})
    message: string;

    @CreatedAt()
    readonly createdAt: Date;

    @UpdatedAt()
    readonly updatedAt: Date;
}
