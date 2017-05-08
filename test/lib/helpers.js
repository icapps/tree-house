import { BaseController, BaseService, BasePolicy, BaseAuthentication } from '../../src/index';
import { main } from '../start.test';


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
        return main.getAuthentication()
            .authenticate(this.req, 'jwt')
            .then(user => Object.assign(this.req, { session: { me: user } }))
            .catch(() => { throw new this.Unauthorised(); });
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
        return main.getAuthentication()
            .authenticate(req)
            .then(user => user)
            .catch(() => { throw new this.Unauthorised('Password and/or emaiul are wrong'); });
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
