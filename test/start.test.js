import { should, expect } from 'chai';
import supertest from 'supertest';

import { TreeHouse, PassportAuthentication, Cipher, Route } from '../src/index';
import { localStrategyConfig, jwtStrategyConfig, onLocalStrategy, onJwtStrategy } from './lib/authentication.config';
import { MockController, MockPolicy } from './lib/helpers';

// Chai init
should();

// CONSTANTS
const CONFIGURATION = {
    port: 5000,
    bodyLimit: '10mb',
    apiKey: 'ga9ul2!MN36nyh64z4d5SC70jS',
    basePath: process.env.BASE_PATH || '/api/v1',
};
const user = {
    email: 'test@treehouse.com',
    password: 'notSoRandom',
};
const mockRequest = supertest(`http://localhost:${CONFIGURATION.port}${CONFIGURATION.basePath}`);

// Variables used during tests
let newApplication;
let authentication;
let mockController;
let routes = [];
let webtoken;

describe('Initialise things before running application', () => {
    describe('Controllers and routes', () => {
        it('Create a new controller', () => {
            mockController = new MockController();
        });

        it('Create new routes from controller', () => {
            routes = [
                new Route('POST', '/login', mockController.login.bind(mockController)),
                new Route('GET', '/user', mockController.getUser.bind(mockController), [MockPolicy]),
                new Route('GET', '/serverError', mockController.sendServerError.bind(mockController)),
                new Route('GET', '/unauthorised', mockController.sendUnauthorised.bind(mockController)),
                new Route('GET', '/badRequest', mockController.sendBadRequest.bind(mockController)),
            ];
        });
    });
});

describe('New instance of a TreeHouse server', () => {
    describe('Initial setup', () => {
        it('Create new instance with the provided configuration', () => {
            newApplication = new TreeHouse(CONFIGURATION);
            newApplication.configuration.should.equal(CONFIGURATION);
            return expect(newApplication.router).not.to.be.empty;
        });

        it('Create Passport authentication', () => {
            authentication = new PassportAuthentication();
        });

        it('Get JWT token without proper configuration', () => {
            expect(authentication.getJwtToken.bind(user)).to.throw(Error);
        });

        it('Set passport configuration', () => {
            authentication.setLocalStrategy(localStrategyConfig, onLocalStrategy);
            authentication.setJwtStrategy(jwtStrategyConfig, onJwtStrategy);

            webtoken = authentication.getJwtToken(user);
            return expect(webtoken).not.to.be.empty;
        });

        it('Set Routes', () => {
            newApplication.setRoutes(routes);
            return expect(newApplication.router.getRoutes()).not.to.be.empty;
        });

        it('Set Authentication', () => {
            newApplication.setAuthentication(authentication);
            return expect(newApplication.authentication).not.to.be.empty;
        });

        it('Fire up the application', () => {
            // Export the main application instance
            module.exports.main = newApplication;
            newApplication.fireUpEngines();
        });
    });

    describe('Cipher helpers', () => {
        it('Hash the current password and compare', () => {
            const hashedPassword = Cipher.getHashedPassword(user.password);
            return expect(Cipher.comparePassword(user.password, hashedPassword)).to.be.true;
        });
    });

    describe('API Calls', () => {
        it('Login with our user', (done) => {
            mockRequest.post('/login')
                .send({ email: user.email, password: user.password })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    webtoken = res.body.token;
                    /* eslint-disable no-unused-expressions */
                    expect(webtoken).not.to.be.empty;
                    return done();
                });
        });
        it('Get current user via authenticated call (JWT in headers)', (done) => {
            mockRequest.get('/user')
                .set('Authorization', `JWT ${webtoken}`)
                .expect(200, done);
        });
        it('Get current user via unauthenticated call (NO JWT in headers)', (done) => {
            mockRequest.get('/user')
                .expect(401, done);
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
