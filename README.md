# Treehouse

NodeJS utilities and handy helpers extending ExpressJS functionalities

[![npm version](https://badge.fury.io/js/tree-house.svg)](https://badge.fury.io/js/tree-house)
[![Dependencies](https://david-dm.org/icapps/tree-house.svg)](https://david-dm.org/icapps/tree-house.svg)
[![Build Status](https://travis-ci.org/icapps/tree-house.svg?branch=master)](https://travis-ci.org/icapps/tree-house)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house/badge.svg)](https://coveralls.io/github/icapps/tree-house)

## Installation

Install via npm

```shell
npm install tree-house
```

or via yarn

```shell
yarn add tree-house
```

## Usage

```javascript
const treehouse = require('tree-house')
```

```javascript
import * as treehouse from 'tree-house'
```

## Security

### setBasicSecurity(app, route, options)

Set some basic Express security using `cors` and `helmet`.

```javascript
const app = express();

treehouse.setBasicSecurity(app, '*', {
  cors: {},   // cors options
  helmet: {}, // helmet options
})
```

- [All available helmet options](https://github.com/helmetjs/helmet)
- [All available cors options](https://github.com/expressjs/cors)

### setBodyParser(app, route, options)

Set a body parser using the `body-parser` module

```javascript
const app = express();

treehouse.setBodyParser(app, '*', {
  json: {},   // json options
  raw: {}, // raw options
  text: {}, // text options
  urlEncoded: {}, // urlEncoded options
})
```

- [All available body parser options](https://github.com/expressjs/body-parser)

### getRateLimiter(options)

Get a rate limiter instance to prevent brute force attacks. This can be used as a middleware in Express.
At the moment there is support for a built in-memorystore or Redis. Both use the `express-brute` module.

```javascript
const app = express();

// In memory store (development purposes)
const globalBruteforce = treehouse.getRateLimiter({
  freeRetries: 1000,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24*60*60, // 1 day (seconds not milliseconds)
});

app.use('/login', globalBruteforce.prevent, ...);

// Using existing Redis client
treehouse.getRateLimiter({
  redis: {
    client: existingClient, // All Redis options or 'client' to use an existing client (see redis-express-brute)
  },
});
```

- [All available Express-brute options](https://github.com/AdamPflug/express-brute)
- [All available Redis options](https://github.com/NodeRedis/node_redis)

## Responder

### handleAsyncFn((req, res, next(optional)) => { ... })

Express middleware that wraps and executes a given function with try/catch to avoid unhandled promises within Express.

```javascript
const app = express();

function getAllUsers(req, res) {
  //  res.send(users) -> return users...
  // or
  // if an unhandled error occurs this will be passed onto the Express error handler instead of raising an UnhandledPromiseRejectionError
}

app.use('/users', treehouse.handleAsyncFn(getAllUsers));
```

## Server

### startServer(app, options, callbackFn (optional))

Start an http or https server using an express instance

```javascript
const app = express();

treehouse.startServer(app, {
  port: 3000,
  title: 'My app'   // optional
  https: {          // optional
    port: 3001,
    privateKey: 'assets/ssl.key',
    certificate: 'assets/ssl.cert',
  }
})
```

## Swagger

### setSwagger(app, route, filePath, options)

Serve Swagger UI via the a provided Swagger yaml file.

```javascript
const app = express();

treehouse.setSwagger(app, '/documentation', 'documentation/swagger.yml', {
  host: 'localhost:3000',
  schemes: ['http'],
};
```

- [All available swagger-ui options](https://github.com/swagger-api/swagger-ui)

## Validator

### validateSchema(schema, options)

Express middleware to validate a Joi schema using the `express-validation` module. This will throw an error as an instance of ExpressValidationError if the Joi validation fails.

```javascript
const schema =   {
  body: {
    name: Joi.string().required(),
  }
};

app.post('/my-endpoint', treehouse.validateSchema(schema), ...);
```

- [All available express-validation options](https://github.com/AndrewKeig/express-validation)

## Tests

- You can run `yarn test` to run all tests
- You can run `yarn test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house/issues](https://github.com/icapps/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
