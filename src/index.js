import 'babel-polyfill';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import RateLimit from 'express-rate-limit';

// Constants configuration
import DEFAULT_APPLICATION_CONFIG from './config/application.config';
import ProcessConfig from './config/process.config';

// Router
import Router from './lib/router/router';
import Route from './lib/router/route';

// Error handler and errors
import ErrorHandler from './lib/handlers/errorHandler';
import BadRequestError from './lib/errors/badRequest';
import ServerError from './lib/errors/serverError';
import UnauthorisedError from './lib/errors/unauthorised';
import NotFoundError from './lib/errors/notFound';
import ValidationError from './lib/errors/validation';

// Base
import BaseController from './lib/base/baseController';
import BaseError from './lib/base/baseError';
import BaseMiddleware from './lib/base/baseMiddleware';
import BaseService from './lib/base/baseService';
import BaseErrorHandler from './lib/base/baseErrorHandler';


// Register all default predefined errors and combine them into a TreeError object
const TreeError = { BadRequest: BadRequestError, Server: ServerError, Unauthorised: UnauthorisedError, NotFound: NotFoundError, Validation: ValidationError };

class TreeHouse {
    constructor(configuration) {
        this.configuration = Object.assign({}, DEFAULT_APPLICATION_CONFIG, configuration);
        this.router = new Router();

        // Default error handler
        this.errorHandler = new ErrorHandler();

        this.setEnvironmentVariables();
        this.initExpressJS();
    }


    /**
     * Intialise all ExpressJS configuration needed for the application to run
     * @memberOf TreeHouse
     */
    initExpressJS() {
        this.express = express();
        this.setSecurity();
        this.setBodyParser();
        this.setRateLimit();
        this.setHeaders();
        this.setRouter();

        // Set our error handler to overwrite express error handler
        this.express.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
          this.errorHandler.execute(res, err);
        });
    }


    /**
     * Set process environment variables
     * @memberOf TreeHouse
     */
    setEnvironmentVariables() {
        process.env.apiKey = this.configuration.apiKey;
    }


    /**
     * Set body parser configuration
     * @memberOf TreeHouse
     */
    setBodyParser() {
        this.express.use(bodyParser.json({ limit: this.configuration.bodyLimit }));
        this.express.use(bodyParser.urlencoded({ extended: true, limit: this.configuration.bodyLimit }));
    }


    /**
     * Set security measurements
     */
    setSecurity() {
        this.express.use(helmet()); // Helmet
        this.express.use(cors(this.configuration.cors)); // Cors
    }


    /**
     * Set a rate limiter
     * Used to limit repeated requests to public APIs and/or endpoints such as password reset
     */
    setRateLimit() {
        if (this.configuration.limiter.trustProxy) this.express.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
        const limiter = new RateLimit(Object.assign({}, this.configuration.limiter));

        //  apply to all requests
        this.express.use(limiter);
    }


    /**
     * Set some header properties, especially needed for development
     * @memberOf TreeHouse
     */
    setHeaders() {
        // Add headers
        this.express.all(`${this.configuration.basePath}/*`, (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            return next();
        });

        // Headers - fix for OPTIONS calls in localhost (Chrome etc.)
        // Only applies when in development mode
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'develop') {
            this.express.all(`${this.configuration.basePath}/*`, (req, res, next) => (req.method.toLowerCase() === 'options' ? res.sendStatus(204) : next()));
        }
    }


    /**
     * Set the express router instance of our router to the base path
     * @memberOf TreeHouse
     */
    setRouter() {
        this.express.use('/', this.router.expressRouter);
    }


    /**
     * Set all routes provided
     * @param {any} routes
     * @memberOf TreeHouse
     */
    setRoutes = (routes) => {
        this.router.setRoutes(routes, this.configuration.basePath, this.errorHandler);
    }


    /**
     * Set a custom error handler
     * @param {any} handler
     * @memberof TreeHouse
     */
    setErrorHandler(handler) {
        this.errorHandler = handler;
    }


    /**
     * Start up project/server
     * @param {Boolean} clustered Start the application in clustered mode or regular mode
     */
    fireUpEngines(clustered = true) {
        new ProcessConfig().start(this.express, this.configuration, clustered);
    }


    /**
     * Set the configuration
     * The configuration can be provided via the constructor or this method afterwards
     * @param {any} newConfiguration
     * @memberOf TreeHouse
     */
    setConfiguration(newConfiguration) {
        this.configuration = newConfiguration;
    }
}

/**
 * Export all exposed variables
 */
module.exports = {
    TreeHouse,
    Route,
    BaseController,
    BaseErrorHandler,
    BaseError,
    BaseMiddleware,
    BaseService,
    TreeError,
};
