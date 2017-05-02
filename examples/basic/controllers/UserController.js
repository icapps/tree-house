import { BaseController } from '../../../src/index';
import UserService from '../services/UserService';

export default class UserController extends BaseController {
    constructor() {
        super();
        this.userService = new UserService();
    }

    getCurrentUser(req, res) {
        return this.execute(res, this.userService.getCurrentUser(req.session.me));
    }

    sendServerError(req, res) {
        return this.execute(res, this.userService.sendServerError());
    }

    sendUnauthorised(req, res) {
        return this.execute(res, this.userService.sendUnauthorised());
    }

    sendBadRequest(req, res) {
        return this.execute(res, this.userService.sendBadRequest());
    }
}
