import app from './bootstrap';

import Kernel from './foundation/kernel';

const kernel = app.get<Kernel>(Kernel);

kernel.run().then(() => {
    process.on('SIGTERM', () => {
        kernel.terminate();
    });

    process.on('SIGINT', () => {
        kernel.terminate();
    });
});
