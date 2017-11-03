import { BaseMiddleware } from '../../../../build';

export default class IsAuthenticated extends BaseMiddleware {
  /**
   * Function to execute when the policy gets triggered by a route
   * This will fake a check if the user who makes the request is authenticated
   * @param {any} req
   * @returns {Promise}
   */
  execute(req, res, next) {
    setTimeout(() => {
      Object.assign(req, { session: { user: { name: 'Brent Van Geertruy' } } });
      next();
    }, 3000);
  }
}
