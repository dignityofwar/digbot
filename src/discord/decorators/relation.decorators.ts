import {applyDecorators} from '@nestjs/common';
import {ManyToOne} from '@mikro-orm/core';

export function DiscordGuild() {
    return applyDecorators(
        ManyToOne({onDelete: 'cascade'}),
    );
}

export function DiscordRole() {
    return applyDecorators(
        ManyToOne({onDelete: 'cascade'}),
    );
}

export function DiscordChannel() {
    return applyDecorators(
        ManyToOne({onDelete: 'cascade'}),
    );
}

export function DiscordEmoji() {
    return applyDecorators(
        ManyToOne({onDelete: 'cascade'}),
    );
}
