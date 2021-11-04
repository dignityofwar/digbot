import {Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import {ClusterClient, ShardClient} from 'detritus-client';

@Injectable()
export class DiscordManager implements OnApplicationBootstrap, OnApplicationShutdown {
    private static readonly logger = new Logger('DiscordClient');

    constructor(
        private readonly client: ClusterClient,
    ) {
        const shardLogger = new Logger();
        const _ = (shard: ShardClient) => `DiscordShard${shard.shardId}`;

        client
            .on('shard',
                ({shard}) => shardLogger.log('Shard ready', _(shard)))
            .on('warn',
                warn => {
                    if ('shard' in warn)
                        shardLogger.warn(warn.error, _(warn.shard));
                    else
                        DiscordManager.logger.warn(warn.error);
                })
            .on('killed',
                killed => {
                    if ('shard' in killed)
                        killed.error
                            ? shardLogger.error(`Shard killed with error: ${killed.error.message}`, killed.error.stack, _(killed.shard))
                            : shardLogger.log('Shard killed', _(killed.shard));
                    else
                        killed.error
                            ? DiscordManager.logger.error(`Client killed with error: ${killed.error.message}`, killed.error.stack)
                            : DiscordManager.logger.log('Client killed');
                })
            .on('unknown',
                payload => {
                    const {d, op, s, t} = payload;
                    shardLogger.warn(`Unknown payload received: ${JSON.stringify({d, op, s, t})}`, _(payload.shard));
                })
            .on('gatewayReady',
                ({shard}) => shardLogger.log('Shard ready', _(shard)))
            .on('gatewayResumed',
                ({shard, raw}) => shardLogger.log(`Shard resumed: ${JSON.stringify(raw)}`, _(shard)));
    }

    async onApplicationBootstrap(): Promise<void> {
        DiscordManager.logger.log('Connecting client');

        await this.client.run();

        DiscordManager.logger.log('Client ready');
    }

    onApplicationShutdown(): void {
        this.client.kill();
    }
}
