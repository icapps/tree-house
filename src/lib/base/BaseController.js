import ResponseHandler from '../handlers/ResponseHandler';
import ErrorHandler from '../handlers/ErrorHandler';

export default class BaseController {
    constructor() {
        this.responseHandler = new ResponseHandler();
        this.errorHandler = new ErrorHandler();
    }


    /**
     * Execute a controller function and handle response/error
     * @param {any} res expressJS response
     * @param {any} fn function that will be executed
     * @returns {ExpressJS Response}
     * @memberOf BaseController
     */
    async execute(res, fn) {
        try {
            const result = await fn;
            this.responseHandler.execute(res, result);
        } catch (error) {
            this.errorHandler.execute(res, error);
        }
    }
}
