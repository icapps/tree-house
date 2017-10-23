// TODO: Set via initial configuration on application level
const BASE_PATH = process.env.BASE_PATH || '/api/v1';

// Basic Route
export default class Route {
  /**
   * Route Constructor
   * @param type
   * @param url
   * @param fn
   * @param middlewares
   */
  constructor(type, url, fn, middlewares = []) {
    Object.assign(this, { type, url, fn, middlewares });
  }


  /**
   * Set function on an express route
   * @param router - ExpressJS router instance
   * @param {String} basePath path used to prefix on every route
   * @param errorHandler - Error handler
   */
  setRoute(router, basePath, errorHandler) {
    if (router) {
      router[this.type.toLowerCase()](`${BASE_PATH}${this.url}`, async (req, res) => {
        // Try to execute controller function and handle any thrown errors
        try {
          await this.fn(res, req); // Pass request as second parameter because not all controllers will use the request
        } catch (error) {
          errorHandler.execute(res, error);
        }
      });
    } else {
      throw new Error('No express router passed to the Route class. Please provide a valid ExpressJS Router instance');
    }
  }


  /**
   * Set middleware(s) on an express route
   * @param router - ExpressJS router instance
   * @param {String} basePath path used to prefix on every route
   * @param errorHandler - Error handler
   */
  setMiddlewares(router, basePath, errorHandler) {
    if (router) {
      this.middlewares.forEach((Middleware) => {
        router.use(`${BASE_PATH}${this.url}`, async (req, res, next) => {
          const middleware = new Middleware();

          // Try to execute middleware function and handle any thrown errors
          try {
            await middleware.execute(req, res);
            next();
          } catch (error) {
            console.log('ERRORRRR', error);
            errorHandler.execute(res, error);
          }
        });
      });
    } else {
      throw new Error('No express router passed to the Route class. Please provide a valid ExpressJS Router instance');
    }
  }
}
