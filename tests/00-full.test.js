import supertest from 'supertest';

import { TreeHouse, Route } from '../src/index';
import { MockController, BaseMockMiddleware, MockMiddleware, MockSecondMiddleware } from './lib/helpers';


// CONSTANTS
const CONFIGURATION = {
  port: 5000,
  bodyLimit: '10mb',
  apiKey: 'ga9ul2!MN36nyh64z4d5SC70jS',
  basePath: process.env.BASE_PATH || '/api/v1',
  workers: 2,
  cors: { optionsSuccessStatus: 200 },
  limiter: {
    trustProxy: false,
    windowMs: 25 * 60 * 1000,
    max: 150,
    delayMs: 100,
  },
};

const FULL_CONFIGURATION = Object.assign({}, CONFIGURATION, {
  https: {
    certificate: 'tests/assets/test-ssl.cert',
    privateKey: 'tests/assets/test-ssl.key',
    port: 5001,
  },
});

const mockRequest = supertest(`http://localhost:${CONFIGURATION.port}${CONFIGURATION.basePath}`);

// Variables used during tests
let newApplication;
let mockController;
let routes = [];

describe('Initialise things before running application', () => {
  describe('Controllers and routes', () => {
    test('Create a new controller', () => {
      mockController = new MockController();
    });

    test('Create new routes from controller', () => {
      const { getUser, getUserArrowFn, sendServerError, sendUnauthorised, sendBadRequest, createUser } = mockController;

      routes = [
        new Route('GET', '/user', getUser, [new MockMiddleware()]),
        new Route('POST', '/user', createUser, [new MockSecondMiddleware()]),
        new Route('GET', '/user-inline', getUserArrowFn, [new MockMiddleware()]),
        new Route('GET', '/user-invalid-middleware', getUser, [new MockMiddleware(true)]),
        new Route('GET', '/serverError', sendServerError),
        new Route('GET', '/unauthorised', sendUnauthorised),
        new Route('GET', '/badRequest', sendBadRequest),
      ];
    });
  });
});

describe('New instance of a TreeHouse server', () => {
  describe('Initial setup', () => {
    test('Create new instance with the provided configuration', () => {
      newApplication = new TreeHouse(CONFIGURATION);
      expect(newApplication.configuration).toEqual(CONFIGURATION);

      newApplication.setConfiguration(FULL_CONFIGURATION);
      expect(newApplication.configuration).toEqual(FULL_CONFIGURATION);

      expect(newApplication.router).not.toBeUndefined();
    });

    test('Set Routes', () => {
      newApplication.setRoutes(routes);
      expect(newApplication.router.getRoutes()).toHaveLength(routes.length);
    });

    test('Fire up the application', () => {
      // Export the main application instance
      module.exports.main = newApplication;
      newApplication.fireUpEngines(false);
    });
  });


  describe('Custom Router and middleware', () => {
    it('Set a route manually without express router set', () => { expect(new Route().setRoute).toThrowError(Error); });
    it('Set middleware manually without express router set', () => { expect(new Route().setMiddlewares).toThrowError(Error); });
  });

  describe('Custom bare extending classes', () => {
    it('Extend BaseMiddleware', () => {
      new BaseMockMiddleware().execute()
        .then(result => expect(result).not.toBeNull);
    });
  });

  describe('API Calls', () => {
    it('Should return 200 response with current user via route with mock middleware', (done) => {
      mockRequest.get('/user')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).toEqual({ user: { name: 'iCappsTestUser' } });
          return done();
        });
    });

    it('Should return 200 response with current user via route with mock middleware', (done) => {
      mockRequest.get('/user-inline')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual({ user: { name: 'iCappsTestUser' } });
          return done();
        });
    });

    it('Should return 401 response when unauthorised via middleware', (done) => {
      mockRequest.get('/user-invalid-middleware')
        .expect(401)
        .end((err, res) => {
          expect(res.body).toHaveProperty('errorCode', 'NOT_AUTHORISED');
          expect(res.body).toHaveProperty('errorMessage');
          done();
        });
    });

    it('Should return 200 response with current user via route', (done) => {
      mockRequest.post('/user')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual({ user: { name: 'iCappsTestUserCreate' } });
          return done();
        });
    });

    it('Get the unauthorized response', (done) => {
      mockRequest.get('/unauthorised')
        .expect(401, done);
    });
    it('Get the BadRequest response', (done) => {
      mockRequest.get('/badRequest')
        .expect(400, done);
    });
    it('Get the serverError response', (done) => {
      mockRequest.get('/serverError')
        .expect(500, done);
    });
  });
});
