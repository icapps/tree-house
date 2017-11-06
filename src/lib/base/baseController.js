import ResponseHandler from '../handlers/responseHandler';

export default class BaseController {
  constructor() {
    this.responseHandler = new ResponseHandler();
  }


  isFunction(functionToCheck) {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }


  /**
   * Execute a controller function and handle response/error
   * @param {any} res expressJS response
   * @param {any} fn function that will be executed
   * @returns {ExpressJS Response}
   * @memberOf BaseController
   */
  async execute(res, fn) {
    try {
      let result = null;
      if (this.isFunction(fn)) {
        result = await fn();
      } else {
        result = await fn;
      }

      this.responseHandler.execute(res, result);
    } catch (error) {
      throw error; // Rethrow error - debug if needed...
    }
  }
}
