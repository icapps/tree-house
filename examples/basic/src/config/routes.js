// Route class
import { Route } from '../../../../build';
import addUserBody from './validation';

// Middleware import
import IsAuthenticated from '../middleware/IsAuthenticated';
import IsValidated from '../middleware/IsValidated';

// Controllers
import UserController from '../controllers/UserController';
import ErrorController from '../controllers/ErrorController';

// Initiate the controllers
const userController = new UserController();
const errorController = new ErrorController();

// Initiate the middleware
const isAuthenticated = new IsAuthenticated();

// Actual routes
const ROUTES = [
  // User controller routes
  new Route('POST', '/login', userController.login),
  new Route('GET', '/currentUser', userController.getUser, [isAuthenticated]),
  new Route('POST', '/createUser', userController.createUser, [new IsValidated(addUserBody)]),

  // Error controller routes
  new Route('GET', '/unauthorised', errorController.unauthorised),
  new Route('GET', '/badRequest', errorController.badRequest),
];

export default ROUTES;
