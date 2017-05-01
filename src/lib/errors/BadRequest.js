import BaseError from '../base/BaseError';

export default class UnauthorisedError extends BaseError {
    constructor(message = 'This call is not valid, and thereby a bad request.', code = 'ERR97') {
        super(message);
        this.statusCode = 400;
        this.code = code;
    }
}
