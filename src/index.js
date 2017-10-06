import 'babel-polyfill';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import RateLimit from 'express-rate-limit';

// Constants configuration
import DEFAULT_APPLICATION_CONFIG from './lib/config';

// Router
import Router from './lib/router/Router';
import Route from './lib/router/Route';

// Error handler and errors
import ErrorHandler from './lib/handlers/ErrorHandler';
import BadRequestError from './lib/errors/BadRequest';
import ServerError from './lib/errors/ServerError';
import UnauthorisedError from './lib/errors/Unauthorised';

// Base
import BaseController from './lib/base/BaseController';
import BaseError from './lib/base/BaseError';
import BaseMiddleware from './lib/base/BaseMiddleware';
import BaseService from './lib/base/BaseService';
import BaseErrorHandler from './lib/base/BaseErrorHandler';

// Register all default predefined errors and combine them into a TreeError object
const TreeError = { BadRequest: BadRequestError, Server: ServerError, Unauthorised: UnauthorisedError };

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
     * Get HTTPS credentials
     * Read out the private key and certificate
     * @returns
     *
     * @memberof TreeHouse
     */
    getHttpsCredentials() {
        if (this.configuration.https.privateKey && this.configuration.https.certificate) {
            try {
                const privateKey = fs.readFileSync(this.configuration.https.privateKey, 'utf8');
                const certificate = fs.readFileSync(this.configuration.https.certificate, 'utf8');
                return { key: privateKey, cert: certificate };
            } catch (e) {
                throw new Error(e);
            }
        } else {
            throw new Error('No private key and/or certificate found required for HTTPS server');
        }
    }


    /**
     * Start up ExpressJS server
     */
    fireUpEngines() {
        const httpServer = http.createServer(this.express);
        httpServer.listen(this.configuration.port);
        console.log(`TreeHouse HTTP NodeJS Server listening on port ${this.configuration.port}`);

        // HTTPS - Optional
        if (this.configuration.https) {
            const httpsServer = https.createServer(this.getHttpsCredentials(), this.express);
            httpsServer.listen(this.configuration.https.port);
            console.log(`TreeHouse HTTPS NodeJS Server listening on port ${this.configuration.https.port}`);
        }
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
