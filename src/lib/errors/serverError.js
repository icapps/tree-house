import BaseError from '../base/baseError';

export default class ServerError extends BaseError {
  constructor(code = 'SERVER_ERROR', message = 'Something went wrong. Our technicians are working on it!') {
    super(message);
    this.statusCode = 500;
    this.code = code;
  }
}
