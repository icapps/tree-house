import ResponseHandler from '../handlers/ResponseHandler';
import ErrorHandler from '../handlers/ErrorHandler';

export default class BaseController {
    constructor() {
        this.responseHandler = new ResponseHandler();
        this.errorHandler = new ErrorHandler();
    }

    /**
     * Execute a controller function and handle response/error
     * @param {any} res
     * @param {any} fn
     * @returns {ExpressJS Response}
     * @memberOf BaseController
     */
    execute(res, fn) {
        return fn
            .then(result => this.responseHandler.execute(res, result))
            .catch(error => this.errorHandler.execute(res, error));
    }
}
