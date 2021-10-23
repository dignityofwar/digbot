import {configStorage} from '../storage';
import {applyDecorators} from '@nestjs/common';
import {Expose} from 'class-transformer';

export function Env(env: string): PropertyDecorator {
    return applyDecorators(
        Expose(),
        (target: object, property: string) => {
            configStorage.setEnvMetadata(target.constructor, property, {env});
        },
    );
}
