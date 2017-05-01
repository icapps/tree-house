import ErrorHandler from '../handlers/ErrorHandler';

export default class BasePolicy {
    constructor(req, res, next) {
        Object.assign(this, { req, res, next });
        this.errorHandler = new ErrorHandler();
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
