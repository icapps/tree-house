import { Application } from 'express';
import { ClientOpts, RedisClient } from 'redis';
import * as ExpressBrute from 'express-brute';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as defaults from '../config/app.config';
const redisStore = require('express-brute-redis');

/**
 * Set some basic security measurements
 */
export function setBasicSecurity(app: Application, route: string, options: SecurityOptions = {}): void {
  app.use(route, helmet(Object.assign({}, defaults.helmetOptions, options.helmet)));
  app.use(route, cors(Object.assign({}, defaults.corsOptions, options.cors)));
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
export function getRateLimiter(options: RateLimiterOptions = {}): ExpressBrute {
  let store: ExpressBrute.MemoryStore;
  const allOptions = Object.assign({}, defaults.rateLimiterOptions, options);

  if (allOptions.redis) {
    store = new redisStore(allOptions.redis);
  } else {
    store = new ExpressBrute.MemoryStore();
  }

  const { redis, ...bruteOptions } = allOptions; // Filter out unneeded properties
  return new ExpressBrute(store, bruteOptions);
}

// Interfaces
export interface RateLimiterOptions extends ExpressBrute.Options {
  redis?: RedisOptions;
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

export interface RedisOptions extends ClientOpts {
  client?: RedisClient;
}
