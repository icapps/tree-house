import BaseError from '../base/baseError';

export default class BadRequestError extends BaseError {
    constructor(message = 'This call is not valid, and thereby a bad request.', code = 'BAD_REQUEST') {
        super(message);
        this.statusCode = 400;
        this.code = code;
    }
}
