import BaseError from '../base/baseError';

export default class UnauthorisedError extends BaseError {
  constructor(message = 'You are not authorised to make this call.', code = 'NOT_AUTHORISED') {
    super(message);
    this.statusCode = 401;
    this.code = code;
  }
}
