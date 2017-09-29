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
     * @param {any} errorHandler
     */
    setExpressRoutes(routes, errorHandler) {
        routes.forEach((route) => {
            route.setPolicies(this.expressRouter);
            route.setRoute(this.expressRouter, errorHandler);
        });
    }

    /**
     * Set routes on object and use express routes
     * @param {any} routes
     * @param {any} errorHandler
     * @memberOf Router
     */
    setRoutes(routes, errorHandler) {
        this.routes = routes;

        // set express routes and policies
        this.setExpressRoutes(this.routes, errorHandler);
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
