import { Application, RequestHandler } from 'express';
import { ClientOpts, RedisClient } from 'redis';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as RateLimit from 'express-rate-limit';

import * as defaults from '../config/app.config';

import redisStore = require('rate-limit-redis');

type HelmetOptions = Parameters<typeof helmet>[0]; // https://github.com/helmetjs/helmet/issues/235

/**
 * Set some basic security measurements
 */
export function setBasicSecurity(app: Application, route: string, options: SecurityOptions = {}): void {
  app.use(route, helmet(Object.assign({}, defaults.helmetOptions, options.helmet)));
  app.use(route, cors(Object.assign({}, defaults.corsOptions, options.cors)));
  // SAFARI BUGFIX: include credentials
  app.use((_req, res, next) => {
    res.set('credentials', 'include');
    next();
  });
}

/**
 * Set a body parser for all specific types at once
 */
export function setBodyParser(app: Application, route: string, options: BodyParserOptions = {}): void {
  const allOptions = Object.assign({}, defaults.bodyParserOptions, options);

  if (allOptions.json) app.use(route, bodyParser.json(allOptions.json));
  if (allOptions.raw) app.use(route, bodyParser.raw(allOptions.raw));
  if (allOptions.text) app.use(route, bodyParser.text(allOptions.text));
  if (allOptions.urlEncoded) app.use(route, bodyParser.urlencoded(allOptions.urlEncoded));
}

/**
 * Get a rate limiter instance
 * Current support for: built-in memory and Redis
 */
export function getRateLimiter(options: RateLimiterOptions = {}): RequestHandler {
  let store: RateLimit.Store;
  const allOptions = Object.assign({}, defaults.rateLimiterOptions, options);

  // Automatically assign new redis store instance
  if (allOptions.redis) {
    store = new redisStore(allOptions.redis);
  }

  const { redis, ...rateOptions } = allOptions; // Filter out unneeded properties
  return RateLimit({
    ...rateOptions,
    store,
  });
}

// Interfaces
export interface RateLimiterOptions extends RateLimit.Options {
  redis?: RedisOptions;
}

export interface SecurityOptions {
  cors?: cors.CorsOptions;
  helmet?: HelmetOptions;
}

export interface BodyParserOptions {
  json?: bodyParser.OptionsJson;
  raw?: bodyParser.Options;
  text?: bodyParser.OptionsText;
  urlEncoded?: bodyParser.OptionsUrlencoded;
}

export interface RedisOptions extends ClientOpts {
  client?: RedisClient;
}
