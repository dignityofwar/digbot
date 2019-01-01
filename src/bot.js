const app = require('./bootstrap');

const kernel = app.resolve('kernel');

/* eslint no-console: 0 */

// TODO: Should be removed, but the stack of unhandled errors are not logged. Cause unknown
process.prependListener('uncaughtException', e => console.log(e instanceof Error ? e.stack : e));
process.prependListener('unhandledRejection', e => console.log(e instanceof Error ? e.stack : e));

kernel.run()
    .then(() => {
        // TODO: Better listeners for termination of the bot
        process.on('SIGTERM', async () => {
            await kernel.terminate();
        });
    });
