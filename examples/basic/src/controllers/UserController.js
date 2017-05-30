import { BaseController } from 'tree-house';
import UserService from '../services/UserService';

export default class UserController extends BaseController {
    constructor() {
        super();
        this.userService = new UserService();
    }

    login = (req, res) => this.execute(res, this.userService.login(req));
    getUser = (req, res) => this.execute(res, this.userService.getUser(req.session.me));
    sendServerError = (req, res) => this.execute(res, this.userService.sendServerError());
    sendUnauthorised = (req, res) => this.execute(res, this.userService.sendUnauthorised());
    sendBadRequest = (req, res) => this.execute(res, this.userService.sendBadRequest());
}
