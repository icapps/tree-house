import { BaseController, BaseService, BasePolicy, BaseAuthentication } from '../../src/index';

/**
 * An authentication class with just its super class methods and variables
 * @export
 * @class BaseMockAuthentication
 * @extends {BaseAuthentication}
 */
export class BaseMockAuthentication extends BaseAuthentication {}

/**
 * A policy class with just its super class methods and variables
 * @export
 * @class BaseMockPolicy
 * @extends {BasePolicy}
 */
export class BaseMockPolicy extends BasePolicy {}


/**
 * A basic policy using the provided authentication method
 *
 * @export
 * @class MockPolicy
 * @extends {BasePolicy}
 */
export class MockPolicy extends BasePolicy {
    setPolicy() {
        Object.assign(this.req, { session: { me: { name: 'iCappsTestUser' } } });
        return Promise.resolve();
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

    getUser = (req, res) => this.execute(res, this.mockService.getUser(req.session.me));
    sendServerError = (req, res) => this.execute(res, this.mockService.sendServerError());
    sendUnauthorised = (req, res) => this.execute(res, this.mockService.sendUnauthorised());
    sendBadRequest = (req, res) => this.execute(res, this.mockService.sendBadRequest());
}
