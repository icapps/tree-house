[![npm version](https://badge.fury.io/js/tree-house.svg)](https://badge.fury.io/js/tree-house)
[![Dependencies](https://david-dm.org/knor-el-snor/tree-house.svg)](https://david-dm.org/knor-el-snor/tree-house.svg)
[![Build Status](https://travis-ci.org/knor-el-snor/tree-house.svg?branch=master)](https://travis-ci.org/knor-el-snor/tree-house)
[![Coverage Status](https://coveralls.io/repos/github/knor-el-snor/tree-house/badge.svg)](https://coveralls.io/github/knor-el-snor/tree-house)

Treehouse
=========

NodeJS project using ExpressJS to create an easy, secure and customisable API layer

## Installation

  `npm install tree-house`

## Usage
> All example code is written in ES6, but usage with ES5 will also properly work with Promise support.

### Configuration

| Key           | Description   | Default value  |
|:------------- |:-------------|:-----|
| port    		| The application will run on this port | 5000 |
| bodyLimit     | Limit used for body-parser      |   10mb |
| apiKey | An api key mapped to `process.env` to use throughout the application      |    ga9ul2!MN36nyh64z4d5SC70jS |
| basePath | The base path used to access all api routes      |   `process.env.BASE_PATH || '/api/v1' ` |
|https| Configuration if you wish to start up an https server | `false`


#####You can create a configuration object with own preferences and set this later on. See below in *Basic Setup*.

```
const myOwnConfiguration = {
	port: 3000,
	bodyLimit: '5mb',
    apiKey: 'myOwnApiKey',
    basePath: process.env.BASE_PATH || '/api',
}
```

#####HTTPS configuration *(optional)*
```
myOwnConfiguration = { 
  // Other configuration ...
  
  https: {
  	certificate: 'path_to_folder/test-ssl.cert',
 	privateKey: 'path_to_folder/test-ssl.key',
  	port: 5001
  }
}
```

###Getting started
####Import the module from `tree-house` and create a new instance.

```
import { TreeHouse } from 'tree-house';
const application = new TreeHouse();
```

If you wish to overwrite the default application configuration, there are two options:

```
const application = new TreeHouse(myOwnConfiguration);
```
*or*

```
const application = new TreeHouse();
application.setConfiguration(myOwnConfiguration);
```

#### Controllers
All controllers need to extend from `BaseController` which only provides one function:
`execute(res, fn)`

> It is required to provide a function that returns a promise

```
import { BaseController } from 'tree-house';

export class MyController extends BaseController {
    constructor() {
        super();
        this.myService = new MyService();      // Needed to use functions from this service
    }

    getAllEmployees = (req, res) => {
        return this.execute(res, this.myService.getEmployees());
    }
}

```
> You need to make sure all functions declared in a controller that are being used by a route are automatically bound to the context of their Controller class by using `fnName = (req, res) => { logic here... }`. Dont't use `fn(req,res) { logic here... }`.

> If you don't use this specific syntax, you won't be able to reference to `this` as the context of the `MyController` class. It will have become an instance of the `Route` class which won't allow you to call `this.execute()` or even `this.myService.getEmployees()`.

#### Services
All services need to extend from `BaseService` which provides a few custom errors with corresponding response codes you can throw at any given moment.

> It is required to return a promise if you wish to invoke the function in a controller as declared above.

```
import { BaseService } from 'tree-house';

export class MyService extends BaseService {
    getEmployees() {
        // Get all employees from db and return them for example
        return myDb.executeQuery('SELECT * FROM EMPLOYEES');
    }
}
```


#### Policies
All policies need to extend from `BasePolicy` which only provides one function:
`setPolicy()`

```
import { application } from './main';
import { BasePolicy } from 'tree-house';

export class MyPolicy extends BasePolicy {
    setPolicy() {
        return application.getAuthentication().authenticate(this.req, 'jwt')
            .then((user) => {
                if (!user) throw new this.Unauthorised();
                return Object.assign(this.req, { session: { me: user } });
            });
    }
}
```


#### Routes
This is one of the most important parts of the application because all the controllers and policies need to be properly set here. You can create a route with path parameters or query parameters as if you would do in a regular expressJS application. [Check the ExpressJS documentation for more information](https://expressjs.com/en/guide/routing.html).

You need to create an array consisting of `Route` objects. A Route object has four parameters:

- HTTP method
- Path of the route (will be prepended by basePath from the configuration)
- Function to call when the route gets triggered
- Array of policies (middleware that gets called before the function above) - *optional*

```
import { Route } from 'tree-house';
import { MyController } from './myController';
import { MyPolicy } from './myPolicy';

const myController = new MyController();
            
const myRoutes = [
    new Route('GET', '/employees', myController.getAllEmployees, [MyPolicy])
```

#### Authentication
All authentication needs to extend from `BaseAuthentication` which only requires the implementation of a function `authenticate()` at the moment. The only built-in authentication is [Passport](http://passportjs.org/) for now. But you can easily integrate your own authentication mechanism.

##### Passport
```
const localStrategyConfig = {
    usernameField: 'email',
    passwordField: 'password',
};

const jwtStrategyConfig = {
    secret: '8^dxE|gZu1ODB183s772)/3:l_#fdsfsdf|2ux3&lhN@LQ6g+"i$zq45fsdq1',
    algorithm: 'HS256',
    expiresIn: 24 * 60 * 60,
    issuer: 'treehouse',
    audience: 'TREEHOUSE',
    authScheme: 'X-Session-Id',
};

// Implement own logic for local authorisation - must return a Promise
function onLocalStrategy(email, password) { 
     // Own authentication logic...
     return Promise.resolve(jwtToken);
}

// Implement own logic for authorisation via JWT - must return a Promise
function onJwtStrategy(payload) {
    // Own authentication logic...
    return Promise.resolve(userData);
}
```
> The next function expects an error as first parameter and the response as second parameter

```
import { PassportAuthentication } from 'tree-house';
const passportAuthentication = new PassportAuthentication();

passportAuthentication.setLocalStrategy(localStrategyConfig, onLocalStrategy);
passportAuthentication.setJwtStrategy(jwtStrategyConfig, onJwtStrategy);
```

#### Set everything onto the main application
```
application.setRoutes(myRoutes);
application.setAuthentication(passportAuthentication);

```

#### Errors
All errors need to extend from `BaseError`. Providing own custom errors is not yet supported at the moment but is already on the roadmap for the next release.

There are a few errors already predefined which can be used in every service extending from `BaseService` or every policy extending from `BasePolicy`. You can even provide a custom message and/or code:

```
throw new this.BadRequest('This is a bad request', 'BAD_REQUEST');
      
throw new this.Unauthorised('You are not authorized to perform this action', 'NOT_AUTHORISED';
      
throw new this.ServerError('Something went wrong', 'SERVER_ERR');
```
##### Predefined errors:
| Error           | Default Message   | Default code  | Status |
|:--------- |:-----------|:------|:---------|
| BadRequest    		| This call is not valid, and thereby a bad request. | BAD_REQUEST | 400 |
| Unauthorised     | You are not authorised to make this call.      |  NOT_AUTHORISED | 401 |
| ServerError | Something went wrong. Our technicians are working on it! | SERVER_ERR |500 |


#### Fire up them engines!
Start up the expressJS server after you've configured everything:

```
application.fireUpEngines()
```

#### Use the instance throughout the application
It's best to use the same instance you've created in your main file throughout your whole application. The best way to achieve this is exporting the instance via `module.exports`:

```
module.exports.application = application;
```

This will allow you to use the same instance in all of your files via proper ES6 imports:

```
import { application } from './main';

// Call all functions and variables via this instance
	application.getConfiguration();
	...
```
## Examples

Example code is provided in the `examples` folder.
  
## Tests

  You can run `npm test` or `npm run cover` to run all tests and get a coverage report.
  
## BUGS

When you find issues, please report them:

- web: [https://github.com/knor-el-snor/tree-house/issues](https://github.com/knor-el-snor/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.


## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.