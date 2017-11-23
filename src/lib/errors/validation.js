import BaseError from '../base/baseError';

export default class ValidationError extends BaseError {
  constructor(code = 'INVALID_REQUEST', message = 'Validation error') {
    super(message);
    this.statusCode = 400;
    this.code = code;
  }
}
