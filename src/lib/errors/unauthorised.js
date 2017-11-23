import BaseError from '../base/baseError';

export default class UnauthorisedError extends BaseError {
  constructor(code = 'NOT_AUTHORISED', message = 'You are not authorised to make this call.') {
    super(message);
    this.statusCode = 401;
    this.code = code;
  }
}
