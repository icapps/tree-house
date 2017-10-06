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

	// Get all employees
    getAllEmployees = (req, res) => this.execute(res, this.myService.getEmployees());
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


#### Middleware
All middleware needs to extend from `BaseMiddleware` which only provides one function:
`execute(req, res)`

```
import { passportAuthentication } from './main'; // Instance created via module tree-house-authentication
import { BaseMiddleware } from 'tree-house';

export class MyPolicy extends BaseMiddleware {
    execute(req, res) {
        return passportAuthentication.authenticate(req, 'jwt')
            .then((user) => {
                if (!user) throw new TreeError.Unauthorised();
                return Object.assign(req, { session: { me: user } });
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
import { MyMiddlewareToExecute } from './myMiddlewareToExecute';

const myController = new MyController();
            
const myRoutes = [
    new Route('GET', '/employees', myController.getAllEmployees, [MyMiddlewareToExecute])
```

#### Set routes onto the main application
```
application.setRoutes(myRoutes);
```

#### Authentication
Install the `tree-house-authentication` module using `npm install tree-house-authentication`.

#### Error handler
There is a default error handler built in, but you can provide your own custom error handler if you want to. The only requirement is that it will need to extend from `BaseErrorHandler` and have an `execute(res, error){}` function.

Example:

```
import { BaseErrorHandler } from 'tree-house';

export default class MyCustomErrorHandler extends BaseErrorHandler {
    execute(res, error) {
        res.status(error.statusCode);
        res.json({ errorMessage: error.message, errorCode: error.code });
    }
}
```

```
const myCustomErrorHandler = new MyCustomErrorHandler();
application.setErrorHandler(myCustomErrorHandler);
```

#### Errors
All errors need to extend from `BaseError`. Treehouse provides some errors out of the box, and you can import them via `import { TreeError } from 'tree-house'`.


```
throw new TreeError.BadRequest('This is a bad request', 'BAD_REQUEST');
      
throw new TreeError.Unauthorised('You are not authorized to perform this action', 'NOT_AUTHORISED';
      
throw new TreeError.ServerError('Something went wrong', 'SERVER_ERR');
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