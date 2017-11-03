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
      router[this.type.toLowerCase()](`${basePath}${this.url}`, async (req, res) => {
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
   */
  setMiddlewares(router, basePath) {
    if (router) {
      this.middlewares.forEach((middleware) => {
        router.use(`${basePath}${this.url}`, async (req, res, next) => {
          // Try to execute middleware function and handle any thrown errors
          try {
            await middleware.execute(req, res, next);
            next(); // Execute next if not called yet
          } catch (error) {
            next(error); // Pass error to express
          }
        });
      });
    } else {
      throw new Error('No express router passed to the Route class. Please provide a valid ExpressJS Router instance');
    }
  }
}
