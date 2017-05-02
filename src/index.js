import express from 'express';
import bodyParser from 'body-parser';

// TODO: Convert into build task exporting all proper functions/variables
// Constants
import { DEFAULT_APPLICATION_CONFIG as DEFAULT_CONFIG } from './lib/constants';

// Router
import Router from './lib/router/Router';
import Route from './lib/router/Route';

// Base
import BaseController from './lib/base/BaseController';
import BaseError from './lib/base/BaseError';
import BasePolicy from './lib/base/BasePolicy';
import BaseService from './lib/base/BaseService';
import BaseAuthentication from './lib/base/BaseAuthentication';

// Authentication
import PassportAuthentication from './lib/authentication/PassportAuthentication';

// Helpers
import * as Cipher from './lib/helpers/Cipher';

class TreeHouse {
    constructor(configuration = DEFAULT_CONFIG) {
        this.configuration = configuration;
        this.router = new Router();
        this.setEnvironmentVariables();
        this.initExpressJS();
    }

    /**
     * Intialise all ExpressJS configuration needed for the application to run
     * @memberOf Combro
     */
    initExpressJS() {
        this.app = express();
        this.setBodyParser();
        this.setHeaders();
        this.setRouter();
        this.setErrorHandling();
        this.setPort();
    }

    /**
     * Set process environment variables
     * @memberOf Combro
     */
    setEnvironmentVariables() {
        process.env.apiKey = this.configuration.apiKey;
    }

    /**
     * Set body parser configuration
     * @memberOf Combro
     */
    setBodyParser() {
        this.app.use(bodyParser.json({ limit: this.configuration.bodyLimit }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: this.configuration.bodyLimit }));
    }

    /**
     * Set some header properties, especially needed for development
     * @memberOf Combro
     */
    setHeaders() {
        // Add headers
        this.app.all('/api/*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            return next();
        });

        // Headers - fix for OPTIONS calls in localhost (Chrome etc.)
        this.app.all('/api/*', (req, res, next) => (req.method.toLowerCase() === 'options' ? res.sendStatus(204) : next()));
    }

    /**
     * Set the express router instance of our router to the base path
     * @memberOf Combro
     */
    setRouter() {
        this.app.use('/', this.router.expressRouter);
    }

    /**
     * Set all routes provided
     * @param {any} routes
     * @memberOf Combro
     */
    setRoutes(routes) {
        this.router.setRoutes(routes);
    }

    /**
     * Return the Authentication if properly set
     * @returns Authentication
     * @memberOf Combro
     */
    getAuthentication() {
        if (this.authentication) {
            if (this.authentication instanceof BaseAuthentication) {
                return this.authentication;
            }
            throw new Error('Authentication handler set, but does not extend from BaseAuthentication');
        }
        throw new Error('Authentication handler not set!');
    }

    /**
     * Set the authentication
     * This needs to be a member of BaseAuthentication to properly function
     * @param {any} authentication
     * @memberOf Combro
     */
    setAuthentication(authentication) {
        this.authentication = authentication;
    }

    /**
     * Set the port the ExpressJS server will run on
     * @memberOf Combro
     */
    // TODO: Implement https
    setPort() {
        this.app.set('port', this.configuration.port);
    }

    setErrorHandling() {
        // TODO: Properly implement
        // catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // TODO: Properly implement
        // error handler
        this.app.use((err, req, res) => {
            // set locals, only providing error in development
            Object.assign(res.locals, {
                message: err.message,
                error: req.app.get('env') === 'development' ? err : {},
            });

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    /**
     * Start up ExpressJS server
     */
    fireUpEngines() {
        this.app.listen(this.configuration.port, () => console.log(`TreeHouse NodeJS Server listening on port ${this.configuration.port}`));
    }

    /**
     * Set the configuration
     * The configuration can be provided via the constructor or this method afterwards
     * @param {any} newConfiguration
     * @memberOf Combro
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
    BaseError,
    BasePolicy,
    BaseService,
    BaseAuthentication,
    PassportAuthentication,
    Cipher,
};
