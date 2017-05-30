import { BaseService } from 'tree-house';
import { main } from '../index';

export default class UserService extends BaseService {
    login(req) {
        return main.getAuthentication()
            .authenticate(req)
            .then(user => user)
            .catch(() => { throw new this.Unauthorised('Password and/or email are wrong'); });
    }

    getUser(currentUser) {
        return Promise.resolve({ user: currentUser });
    }

    sendServerError() {
        throw new this.ServerError();
    }

    sendUnauthorised() {
        throw new this.Unauthorised();
    }

    sendBadRequest() {
        throw new this.BadRequest();
    }
}
