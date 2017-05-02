import { BaseService } from '../../../src/index';

export default class UserService extends BaseService {
    getCurrentUser(currentUser) {
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
