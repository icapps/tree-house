import { BaseController } from '../../../../build';
import UserService from '../services/UserService';

export default class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService(); // Manual DI
  }

  /**
   * Login the user
   * @param {Response} res express response
   */
  login = res => this.execute(res, this.userService.login());


  /**
   * Get the current user
   * @param {Response} res express response
   * @param {Request} req express request
   * @returns {Promise}
   */
  getUser = (res, req) => this.execute(res, this.userService.getUser(req.session.user));


  /**
   * Create a new user
   * @param {Response} res express response
   * @param {Request} req express request
   * @returns {Promise}
   */
  createUser = (res, req) => this.execute(res, this.userService.createUser(req.body));


  /**
   * Send an unauthorised response
   * @param {Response} res express response
   * @returns {Promise}
   */
  isUnauthorised = res => this.execute(res, this.userService.unauthorisedAccess());


  /**
   * Send an unauthorised response
   * @param {Response} res express response
   * @returns {Promise}
   */
  badRequest = res => this.execute(res, this.userService.badRequest());
}
