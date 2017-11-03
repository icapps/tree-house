import BaseError from '../base/baseError';

export default class NotFoundError extends BaseError {
  constructor(message = 'The resource could not be found.', code = 'NOT_FOUND') {
    super(message);
    this.statusCode = 404;
    this.code = code;
  }
}
