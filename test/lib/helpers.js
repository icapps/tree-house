import { BaseController, BaseService, BaseMiddleware, TreeError } from '../../src/index';


/**
 * A middleware class with just its super class methods and variables
 * @export
 * @class BaseMockMiddleware
 * @extends {BaseMiddleware}
 */
export class BaseMockMiddleware extends BaseMiddleware {}


/**
 * A basic middleware using the provided authentication method
 *
 * @export
 * @class MockMiddleware
 * @extends {BasePolicy}
 */
export class MockMiddleware extends BaseMiddleware {
    execute(req) {
        return Object.assign(req, { session: { user: { name: 'iCappsTestUser' } } });
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
        return { user: currentUser };
    }

    sendServerError() {
        throw new TreeError.Server();
    }

    sendUnauthorised() {
        throw new TreeError.Unauthorised();
    }

    sendBadRequest() {
        throw new TreeError.BadRequest();
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

    getUser = (res, req) => this.execute(res, this.mockService.getUser(req.session.user));
    sendServerError = res => this.execute(res, this.mockService.sendServerError());
    sendUnauthorised = res => this.execute(res, this.mockService.sendUnauthorised());
    sendBadRequest = res => this.execute(res, this.mockService.sendBadRequest());
}
