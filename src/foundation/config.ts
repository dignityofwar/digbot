import { injectable } from 'inversify';

@injectable()
export default class Config {
    public readonly discordToken: string = process.env.DISCORD_TOKEN || '';
}
