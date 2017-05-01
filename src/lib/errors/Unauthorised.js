import BaseError from '../base/BaseError';

export default class UnauthorisedError extends BaseError {
    constructor(message = 'You are not authorised to make this call.', code = 'ERR98') {
        super(message);
        this.statusCode = 401;
        this.code = code;
    }
}
