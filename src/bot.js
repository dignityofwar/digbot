const app = require('./bootstrap');

const kernel = app.resolve('kernel');

global.app = app;

kernel.run()
    .then(() => {
        // TODO: Better listeners for termination of the bot
        process.on('SIGTERM', async () => {
            await kernel.terminate();
        });

        process.on('SIGINT', async () => {
            await kernel.terminate();
        });

        process.on('exit', async () => {
            await kernel.terminate();
        });
    });
