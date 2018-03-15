/**
 * DEFAULTS
*/

// Helmet
export const helmetOptions = {};

// Bodyparser
export const bodyParserOptions = {
  json: {
    limit: '10mb',
  },
  urlEncoded: {
    limit: '10mb',
    extended: true,
  },
};

// Cors
export const corsOptions = {
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Rate limiter
export const rateLimiterOptions = {
  freeRetries: 15,
  lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
  redis: null,
};
