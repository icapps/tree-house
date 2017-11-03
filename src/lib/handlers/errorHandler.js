import BaseErrorHandler from '../base/baseErrorHandler';

export default class ErrorHandler extends BaseErrorHandler {
  /**
   * Pass an Error to an Express response
   * @param {any} res
   * @param {any} error
   * @memberOf ErrorHandler
   */
  execute(res, error) {
    if (error.statusCode) {
      res.status(error.statusCode);
      res.json({ errorMessage: error.message, errorCode: error.code });
    } else {
      res.status(500);
      res.send(error);
    }
  }
}
