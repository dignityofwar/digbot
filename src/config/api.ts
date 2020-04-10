export default class Api {
    public readonly enabled: boolean = /^true$/i.test(process.env.API_ENABLED?.trim() ?? '');
}
