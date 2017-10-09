import { should, expect } from 'chai';
import supertest from 'supertest';

import { TreeHouse, Route } from '../src/index';
import { MockController, BaseMockMiddleware, MockMiddleware } from './lib/helpers';

// Chai init
should();

// CONSTANTS
const CONFIGURATION = { port: 5000,
    bodyLimit: '10mb',
    apiKey: 'ga9ul2!MN36nyh64z4d5SC70jS',
    basePath: process.env.BASE_PATH || '/api/v1',
    workers: 2,
    cors: { optionsSuccessStatus: 200 },
    limiter: { trustProxy: false,
        windowMs: 25 * 60 * 1000,
        max: 150,
        delayMs: 100 } };

const FULL_CONFIGURATION = Object.assign({}, CONFIGURATION, { https: { certificate: 'test/assets/test-ssl.cert',
        privateKey: 'test/assets/test-ssl.key',
        port: 5001 } });

const mockRequest = supertest(`http://localhost:${CONFIGURATION.port}${CONFIGURATION.basePath}`);

// Variables used during tests
let newApplication;
let mockController;
let routes = [];

describe('Initialise things before running application', () => {
    describe('Controllers and routes', () => {
        it('Create a new controller', () => {
            mockController = new MockController();
        });

        it('Create new routes from controller', () => {
            const { getUser, sendServerError, sendUnauthorised, sendBadRequest } = mockController;

            routes = [
                new Route('GET', '/user', getUser, [MockMiddleware]),
                new Route('GET', '/serverError', sendServerError),
                new Route('GET', '/unauthorised', sendUnauthorised),
                new Route('GET', '/badRequest', sendBadRequest),
            ];
        });
    });
});

describe('New instance of a TreeHouse server', () => {
    describe('Initial setup', () => {
        it('Create new instance with the provided configuration', () => {
            newApplication = new TreeHouse(CONFIGURATION);
            expect(newApplication.configuration).to.eql(CONFIGURATION);

            newApplication.setConfiguration(FULL_CONFIGURATION);
            expect(newApplication.configuration).to.eql(FULL_CONFIGURATION);

            return expect(newApplication.router).not.to.be.empty;
        });

        it('Set Routes', () => {
            newApplication.setRoutes(routes);
            return expect(newApplication.router.getRoutes()).not.to.be.empty;
        });

        it('Fire up the application', () => {
            // Export the main application instance
            module.exports.main = newApplication;
            newApplication.fireUpEngines(false);
        });
    });


    describe('Custom Router and Policies', () => {
        it('Set a route manually without express router set', () => { expect(new Route().setRoute).to.throw(Error); });
        it('Set policies manually without express router set', () => { expect(new Route().setMiddlewares).to.throw(Error); });
    });

    describe('Custom bare extending classes', () => {
        it('Extend BaseMiddleware', () => {
            new BaseMockMiddleware().execute()
                .then(result => expect(result).not.to.be.empty);
        });
    });

    describe('API Calls', () => {
       it('Get current user via route with mock policy', (done) => {
            mockRequest.get('/user')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.eql({ user: { name: 'iCappsTestUser' } });
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
