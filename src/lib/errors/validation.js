import BaseError from '../base/baseError';

export default class ValidationError extends BaseError {
  constructor(message = 'Validation error', code = 'INVALID_REQUEST') {
    super(message);
    this.statusCode = 400;
    this.code = code;
  }
}
