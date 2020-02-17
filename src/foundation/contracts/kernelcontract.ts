export default interface Kernelcontract {
    /**
     * Starts running the app
     *
     * @return {Promise<void>}
     */
    run(): Promise<void>;

    /**
     * Terminates the app
     *
     * @param {number} code
     * @return {Promise<void>}
     */
    terminate(code?: number): Promise<void>;
}
