import { Application } from 'express';
import { ClientOpts } from 'redis';
import * as ExpressBrute from 'express-brute';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as defaults from '../config/appConfig';
const redisStore = require('express-brute-redis');


/**
 * Set headers for local development (Should only be used when environment is DEVELOPMENT)
 * Fix for Chrome etc. (headers for local development)
 */
export function setLocalHeaders(app: Application, route: string): void {
  // Add headers
  app.use(route, (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    return next();
  });

  // Headers - fix for OPTIONS calls in localhost (Chrome etc.)
  app.use(route, (req, res, next) => (req.method.toLowerCase() === 'options' ? res.sendStatus(204) : next()));
}


/**
 * Set some basic security measurements
 */
export function setBasicSecurity(app: Application, route: string, options: SecurityOptions): void {
  app.use(route, helmet(Object.assign({}, defaults.helmetOptions, options.helmet)));
  app.use(route, cors(Object.assign({}, defaults.corsOptions, options.cors)));
}


/**
 * Set a body parser for all specific types at once
 */
export function setBodyParser(app: Application, route: string, options: BodyParserOptions): void {
  const allOptions = Object.assign({}, defaults.bodyParserOptions, options);

  if (allOptions.json) app.use(route, bodyParser.json(allOptions.json));
  if (allOptions.raw) app.use(route, bodyParser.raw(allOptions.raw));
  if (allOptions.text) app.use(route, bodyParser.text(allOptions.text));
  if (allOptions.urlEncoded) app.use(route, bodyParser.urlencoded(allOptions.urlEncoded));
}


/**
 * Set a rate limiter on a specific route
 * Current support for: built-in memory and Redis
 */

// TODO: Research whether trust proxy for Heroku is required
export function setRateLimiter(app: Application, route: string, options: RateLimiterOptions): void {
  let store: ExpressBrute.MemoryStore;
  const allOptions = Object.assign({}, defaults.rateLimiterOptions, options);

  if (allOptions.redis) {
    store = new redisStore(allOptions.redis);
  } else {
    store = new ExpressBrute.MemoryStore();
  }

  const { redis, ...bruteOptions } = allOptions; // Filter out unneeded properties
  app.use(route, new ExpressBrute(store, bruteOptions).prevent);
}


// Interfaces
export interface RateLimiterOptions extends ExpressBrute.Options {
  redis?: ClientOpts;
}

export interface SecurityOptions {
  cors?: cors.CorsOptions;
  helmet?: helmet.IHelmetConfiguration;
}

export interface BodyParserOptions {
  json?: bodyParser.OptionsJson;
  raw?: bodyParser.Options;
  text?: bodyParser.OptionsText;
  urlEncoded?: bodyParser.OptionsUrlencoded;
}
