import { BaseController, BaseService, BasePolicy } from '../../src/index';

export class MockPolicy extends BasePolicy {
    setPolicy() {
        return new Promise((resolve) => {
            Object.assign(this.req, { session: { me: { isAuthenticated: true } } });
            resolve();
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
    sendUser(req, res) {
        return this.execute(res, this.userService.getCurrentUser(req.session.me));
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

    sendUser(currentUser) {
        return Promise.resolve({ user: currentUser });
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
