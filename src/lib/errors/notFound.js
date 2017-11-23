import BaseError from '../base/baseError';

export default class NotFoundError extends BaseError {
  constructor(code = 'NOT_FOUND', message = 'The resource could not be found.') {
    super(message);
    this.statusCode = 404;
    this.code = code;
  }
}
