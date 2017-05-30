import bunyan from 'bunyan';
import BaseLogger from '../../lib/base/BaseLogger';

export default class BunyanLogger extends BaseLogger {
    constructor(options) {
        super();
        this.options = options;

        // Initialise new instance of Bunyan
        this.logger = bunyan.createLogger({ options });
    }

    /**
     * Get the current Bunyan logger instance
     * @readonly
     * @memberof BunyanLogger
     */
    get logger() {
        return this.logger;
    }

    /**
     * Set the Bunyan logger instance
     * @param newLogger
     */
    set logger(newLogger) {
        this.logger = newLogger;
    }

    /**
     * Log an info message
     * @param {any} message
     * @param {any} parameters
     * @memberof BunyanLogger
     */
    info(message, parameters) {
        this.logger.info(message, parameters);
    }

    /**
     * Log a warning message
     * @param {any} message
     * @param {any} parameters
     * @memberof BunyanLogger
     */
    warn(message, parameters) {
        this.logger.warn(message, parameters);
    }

    /**
     * Log a debugging message
     * @param {any} message
     * @param {any} parameters
     * @memberof BunyanLogger
     */
    debug(message, parameters) {
        this.logger.debug(message, parameters);
    }

    /**
     * Log a general error message
     * @param {any} message
     * @param {any} parameters
     * @memberof BunyanLogger
     */
    error(message, parameters) {
        this.logger.error(message, parameters);
    }

    /**
     * Log a fatal error message
     * @param {any} message
     * @param {any} parameters
     * @memberof BunyanLogger
     */
    fatal(message, parameters) {
        this.logger.fatal(message, parameters);
    }

    /**
     * Log a trace message
     * @param {any} message
     * @param {any} parameters
     * @memberof BunyanLogger
     */
    trace(message, parameters) {
        this.logger.trace(message, parameters);
    }
}
