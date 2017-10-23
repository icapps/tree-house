import { BaseController } from '../../../../build';
import ErrorService from '../services/ErrorService';

export default class ErrorController extends BaseController {
  constructor() {
    super();
    this.errorService = new ErrorService();
  }

  /**
   * Send an unauthorised error response
   * @param {Response} res express response
   * @returns {Promise}
   */
  unauthorised = res => this.execute(res, this.errorService.unauthorisedAccess());


  /**
   * Send an bad request error response
   * @param {Response} res express response
   * @returns {Promise}
   */
  badRequest = res => this.execute(res, this.errorService.badRequest());
}
