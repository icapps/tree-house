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
 * Fake a timeout for asynchronous operations
 * @export
 * @class MockMiddleware
 * @extends {BasePolicy}
 */
export class MockMiddleware extends BaseMiddleware {
  constructor(isInvalidMock = false) {
    super();
    this.isInvalidMock = isInvalidMock;
  }

  execute(req, res, next) {
    if (this.isInvalidMock) throw new TreeError.Unauthorised('NOT_AUTHORISED', 'Not an authorised request');
    setTimeout(() => {
      Object.assign(req, { session: { user: { name: 'iCappsTestUser' } } });
      next();
    }, 1000);
  }
}


export class MockSecondMiddleware extends BaseMiddleware {
  execute(req, res, next) {
    Object.assign(req, { session: { user: { name: 'iCappsTestUserCreate' } } });
    next();
  }
}


/**
 * A service extending from BaseService
 * Use timeout to fake an asynchrous operation
 * @export
 * @class MockService
 * @extends {BaseService}
 */
export class MockService extends BaseService {
  getUser(currentUser) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: currentUser });
      }, 500);
    });
  }

  createUser(currentUser) {
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
  getUserArrowFn = (res, req) => this.execute(res, () => new Promise((resolve) => {
    resolve({ user: req.session.user });
  }));

  createUser = (res, req) => this.execute(res, this.mockService.createUser(req.session.user));

  sendServerError = res => this.execute(res, this.mockService.sendServerError());
  sendUnauthorised = res => this.execute(res, this.mockService.sendUnauthorised());
  sendBadRequest = res => this.execute(res, this.mockService.sendBadRequest());
}
