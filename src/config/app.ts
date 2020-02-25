import AppContract from './contracts/appcontract';

export default class App implements AppContract {
    /**
     * @type {boolean} Set to true when developing the application, this will provide more information for debugging
     */
    public readonly debug: boolean = /^true$/i.test(process.env.DEBUG?.trim() || '');
}
