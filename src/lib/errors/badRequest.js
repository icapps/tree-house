import BaseError from '../base/baseError';

export default class BadRequestError extends BaseError {
  constructor(code = 'BAD_REQUEST', message = 'This call is not valid, and thereby a bad request.') {
    super(message);
    this.statusCode = 400;
    this.code = code;
  }
}
