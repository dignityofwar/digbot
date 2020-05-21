import { Logger } from 'winston';

export function catchAndLogAsync(logger: Logger): Function {
    return (target: any, propertyName: any, descriptor: any): void => {
        const method = descriptor.value;

        descriptor.value = (...args: any) => {
            return method.apply(target, args)
                .catch((e: any) => logger.error(e.stack ?? e.toString()));
        };
    };
}

export function catchAndLog(logger: Logger): Function {
    return (target: any, propertyName: any, descriptor: any): void => {
        const method = descriptor.value;

        descriptor.value = (...args: any) => {
            try {
                return method.apply(target, args);
            } catch (e) {
                logger.error(e.stack ?? e.toString());
            }
        };
    };
}


