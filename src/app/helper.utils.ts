export function crashOnUnhandledRejection(): void {
    process.on('unhandledRejection', e => {throw e;});
}
