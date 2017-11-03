import BaseError from '../base/baseError';

export default class ValidationError extends BaseError {
  constructor(message = 'Validation error', code = 'VALIDATION_ERROR') {
    super(message);
    this.statusCode = 400;
    this.code = code;
  }
}
