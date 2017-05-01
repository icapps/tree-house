import BaseError from '../base/BaseError';

export default class ServerError extends BaseError {
    constructor(message = 'Something went wrong. Our technicians are working on it!', code = 'ERR99') {
        super(message);
        this.statusCode = 500;
        this.code = code;
    }
}
