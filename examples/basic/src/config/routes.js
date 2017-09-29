// Route class
import { Route } from 'tree-house';

// Controllers
import UserController from '../controllers/UserController';


// Initiate the controllers
const userController = new UserController();

// Actual routes
const ROUTES = [
    new Route('POST', '/login', userController.login),
    new Route('GET', '/serverError', userController.sendServerError),
    new Route('GET', '/unauthorised', userController.sendUnauthorised),
    new Route('GET', '/badRequest', userController.sendBadRequest),
];

export default ROUTES;
