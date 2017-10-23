import BaseError from '../base/baseError';

export default class ServerError extends BaseError {
  constructor(message = 'Something went wrong. Our technicians are working on it!', code = 'SERVER_ERR') {
    super(message);
    this.statusCode = 500;
    this.code = code;
  }
}
