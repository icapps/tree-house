import { BaseController, BaseService, BasePolicy } from '../../src/index';
import { main } from '../start.test';

export class MockPolicy extends BasePolicy {
    setPolicy() {
        return main.getAuthentication().authenticate(this.req, 'jwt')
            .then((user) => {
                if (!user) throw new this.Unauthorised();
                Object.assign(this.req, { session: { me: user } });

                return user;
            });
    }
}

/**
 * A service extending from BaseService
 *
 * @export
 * @class MockService
 * @extends {BaseService}
 */
export class MockService extends BaseService {
    login(req) {
        return main.getAuthentication().authenticate(req)
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

/**
 * A controller extending from BaseController
 *
 * @export
 * @class MockController
 * @extends {BaseController}
 */
export class MockController extends BaseController {
    constructor() {
        super();
        this.mockService = new MockService();
    }

    login(req, res) {
        return this.execute(res, this.mockService.login(req));
    }

    getUser(req, res) {
        return this.execute(res, this.mockService.getUser(req.session.me));
    }

    sendServerError(req, res) {
        return this.execute(res, this.mockService.sendServerError());
    }

    sendUnauthorised(req, res) {
        return this.execute(res, this.mockService.sendUnauthorised());
    }

    sendBadRequest(req, res) {
        return this.execute(res, this.mockService.sendBadRequest());
    }
}