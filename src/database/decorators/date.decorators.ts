import {applyDecorators} from '@nestjs/common';
import {Property} from '@mikro-orm/core';

export function CreatedAt() {
    return applyDecorators(
        Property({onCreate: () => new Date()}),
    );
}

export function UpdatedAt() {
    return applyDecorators(
        Property({onUpdate: () => new Date, onCreate: () => new Date()}),
    );
}
