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
     * Used to perform an operation getting data
     * @param {any} context
     * @param {Array} valuesToGet
     * @param {Object} filters
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    get(context, valuesToGet, filters) {
        return Promise.resolve({ context, valuesToGet, filters });
    }


    /**
     * Used to perform an operation creating new data
     * @param {any} context
     * @param {Array} valuesToInsert
     * @param {Array} valuesToOutput
     * @param {Object} filters
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    create(context, valuesToInsert, valuesToOutput, filters) {
        return Promise.resolve({ context, valuesToInsert, valuesToOutput, filters });
    }


    /**
     * Used to perform an operation updating existing data
     * @param {any} context
     * @param {Array} valuesToUpdate
     * @param {Array} valuesToOutput
     * @param {Object} filters
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    update(context, valuesToUpdate, valuesToOutput, filters) {
        return Promise.resolve({ context, valuesToUpdate, valuesToOutput, filters });
    }


    /**
     * Used to perform an operation deleting existing data
     * @param {any} context
     * @param {Object} filters
     * @returns {Promise}
     * @memberof BaseDatabase
     */
    destroy(context, filters) {
        return Promise.resolve({ context, filters });
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
