// Route class
import { Route } from '../../../src/index';

// Controllers
import UserController from '../controllers/UserController';

// Policies
import HasApiHeaderPolicy from '../policies/HasApiHeader';

// Initiate the controllers
const userController = new UserController();

// Actual routes
const ROUTES = [
    new Route('GET', '/user', userController.getCurrentUser.bind(userController), [HasApiHeaderPolicy]),
    new Route('GET', '/serverError', userController.sendServerError.bind(userController)),
    new Route('GET', '/unauthorised', userController.sendUnauthorised.bind(userController)),
    new Route('GET', '/badRequest', userController.sendBadRequest.bind(userController)),
];

export default ROUTES;
