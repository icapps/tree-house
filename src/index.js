import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import fs from 'fs';
import http from 'http';
import https from 'https';

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
     * @memberOf TreeHouse
     */
    initExpressJS() {
        this.app = express();
        this.setSecurity();
        this.setBodyParser();
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
        this.app.use(bodyParser.json({ limit: this.configuration.bodyLimit }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: this.configuration.bodyLimit }));
    }

    setSecurity() {
        this.app.use(helmet());
    }

    /**
     * Set some header properties, especially needed for development
     * @memberOf TreeHouse
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
     * @memberOf TreeHouse
     */
    setRouter() {
        this.app.use('/', this.router.expressRouter);
    }

    /**
     * Set all routes provided
     * @param {any} routes
     * @memberOf TreeHouse
     */
    setRoutes(routes) {
        this.router.setRoutes(routes);
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
        }
        throw new Error('No private key and/or certificate required for HTTPS server');
    }

    /**
     * Return the Authentication if properly set
     * @returns Authentication
     * @memberOf TreeHouse
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
     * @memberOf TreeHouse
     */
    setAuthentication(authentication) {
        this.authentication = authentication;
    }

    /**
     * Start up ExpressJS server
     */
    fireUpEngines() {
        const httpServer = http.createServer(this.app);
        httpServer.listen(this.configuration.port);
        console.log(`TreeHouse HTTP NodeJS Server listening on port ${this.configuration.port}`);

        // HTTPS - Optional
        if (this.configuration.https) {
            const httpsServer = https.createServer(this.getHttpsCredentials(), this.app);
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
    BaseError,
    BasePolicy,
    BaseService,
    BaseAuthentication,
    PassportAuthentication,
    Cipher,
};
