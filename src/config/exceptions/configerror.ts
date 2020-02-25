export default class ConfigError extends Error {
    public constructor(message: string) {
        super(message);

        this.name = 'ConfigError';
    }
}
