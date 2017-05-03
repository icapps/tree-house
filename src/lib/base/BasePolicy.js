import ErrorHandler from '../handlers/ErrorHandler';
import ServerError from '../errors/ServerError';
import Unauthorised from '../errors/Unauthorised';
import BadRequest from '../errors/BadRequest';

export default class BasePolicy {
    constructor(req, res, next) {
        Object.assign(this, { req, res, next });
        this.errorHandler = new ErrorHandler();

        // Define all errors needed in the services with inheritance to BasePolicy
        this.ServerError = ServerError;
        this.Unauthorised = Unauthorised;
        this.BadRequest = BadRequest;
    }

    /**
     * Execute the policy
     * @memberOf BasePolicy
     */
    execute() {
        return this.setPolicy()
            .then(() => this.next())
            .catch(error => this.errorHandler.execute(this.res, error));
    }

    /**
     * Basic policy function always resolves if not overwritten
     * @returns {Promise}
     * @memberOf BasePolicy
     */
    setPolicy() {
        return Promise.resolve();
    }
}
