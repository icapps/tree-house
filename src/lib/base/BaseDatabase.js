export default class BaseDatabase {
    constructor(configuration) {
        this.configuration = configuration;
        this.connection = null;
    }


    /**
     * Connect to the currently set connection
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    connect() {
        const connection = this.getConnection();
        return Promise.resolve({ connection });
    }


    /**
     * Disconnect from the currently active connection
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    disconnect() {
        return Promise.resolve();
    }

    /**
     * Handle errors within a database operation
     * @returns {any}
     * @memberof BaseDatabase
     */
    handleErrors(errors) {
        return new Error('Something went wrong during your database operation', errors);
    }

    /**
     * Execute a database query
     * @param {any} q query string
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    query(q) {
        return Promise.resolve(q);
    }

    /**
     * Set the configuration of the database connection
     * @param {any} newConfiguration
     * @memberof BaseDatabase
     */
    setConfiguration(newConfiguration) {
        this.configuration = newConfiguration;
    }


    /**
     * Set a new connection object
     * @param {any} newConnection
     * @memberof BaseDatabase
     */
    setConnection(newConnection) {
        this.connection = newConnection;
    }


    /**
     * Get the current connection object
     * @returns {Object} connection
     * @memberof BaseDatabase
     */
    getConnection() {
        if (this.connection) {
            return this.connection;
        }
        throw new Error('No proper connection object set');
    }
}
