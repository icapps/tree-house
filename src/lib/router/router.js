import express from 'express';

/**
 * Basic Router used for express api routes
 */
export default class Router {
  /**
   * Router constructor
   */
  constructor() {
    this.expressRouter = express.Router();
    this.routes = [];
  }

  /**
   * Set the routes onto the express router
   * @param routes
   * @param {String} basePath path used to prefix on every route
   * @param {any} errorHandler
   */
  setExpressRoutes(routes, basePath, errorHandler) {
    routes.forEach((route) => {
      route.setMiddlewares(this.expressRouter, basePath);
      route.setRoute(this.expressRouter, basePath, errorHandler);
    });
  }

  /**
   * Set routes on object and use express routes
   * @param {any} routes
   * @param {String} basePath path used to prefix on every route
   * @param {any} errorHandler
   * @memberOf Router
   */
  setRoutes(routes, basePath, errorHandler) {
    this.routes = routes;

    // set express routes and middleware
    this.setExpressRoutes(this.routes, basePath, errorHandler);
  }

  /**
   * Return all defined routes
   * @returns {Array}
   * @memberof Router
   */
  getRoutes() {
    return this.routes;
  }
}
