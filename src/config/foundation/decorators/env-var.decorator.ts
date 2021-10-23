import {configStorage} from '../storage';

export function Env(env: string): PropertyDecorator {
    return function (target: object, property: string) {
        configStorage.setEnvMetadata(target.constructor, property, {env});
    };
}
