import BaseErrorHandler from '../base/baseErrorHandler';

export default class ErrorHandler extends BaseErrorHandler {
  /**
   * Pass an Error to an Express response
   * @param {any} err
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @memberOf ErrorHandler
   */
  execute(err, req, res, next) { // eslint-disable-line no-unused-vars
    if (err.statusCode) {
      res.status(err.statusCode);
      res.json({ errorMessage: err.message, errorCode: err.code });
    } else {
      next(err);
    }
  }
}
