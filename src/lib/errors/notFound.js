import BaseError from '../base/baseError';

export default class NotFoundError extends BaseError {
  constructor(code = 200, message = 'The resource could not be found.') {
    super(message);
    this.statusCode = 404;
    this.code = code;
  }
}
