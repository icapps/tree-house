// Route class
import { Route } from '../../../../build';

// Middleware import
import IsAuthenticated from '../middleware/IsAuthenticated';

// Controllers
import UserController from '../controllers/UserController';
import ErrorController from '../controllers/ErrorController';

// Initiate the controllers
const userController = new UserController();
const errorController = new ErrorController();

// Actual routes
const ROUTES = [
    // User controller routes
    new Route('POST', '/login', userController.login),
    new Route('GET', '/currentUser', userController.getUser, [IsAuthenticated]),

    // Error controller routes
    new Route('GET', '/unauthorised', errorController.unauthorised),
    new Route('GET', '/badRequest', errorController.badRequest),
];


export default ROUTES;
