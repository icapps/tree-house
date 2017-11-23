import BaseError from '../base/baseError';

export default class UnauthorisedError extends BaseError {
  constructor(code = 100, message = 'You are not authorised to make this call.') {
    super(message);
    this.statusCode = 401;
    this.code = code;
  }
}
