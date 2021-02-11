export function crashOnUnhandledRejection(): void {
    process.on('unhandledRejection', (err) => {
        throw err;
    });
}
