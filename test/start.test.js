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
    apiKey: 'ga9ul2!MN36nyh64z4d5SC70jv-YJV:c0XzN8be}_I24j0qYjs*%zCb01CaHCm6U_S',
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
                new Route('GET', '/currentUser', mockController.sendUser.bind(mockController), [MockPolicy]),
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
        });

        it('Create Passport authentication', () => {
            authentication = new PassportAuthentication(localStrategyConfig, jwtStrategyConfig);
            authentication.setLocalStrategy(onLocalStrategy);
            authentication.setJwtStrategy(onJwtStrategy);

            webtoken = authentication.getJwtToken(user);
            return expect(webtoken).not.to.be.empty;
        });

        it('Set Routes', () => {
            newApplication.setRoutes(routes);
        });

        it('Set Authentication', () => {
            newApplication.setAuthentication(authentication);
        });

        it('Fire up the application', () => {
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
        it('Get the unauthorized response', (done) => {
            mockRequest.get('/unauthorised')
                .expect(401)
                .end((err) => {
                    if (err) return done(err);
                    return done();
                });
        });
        it('Get the BadRequest response', (done) => {
            mockRequest.get('/badRequest')
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    return done();
                });
        });
        it('Get the serverError response', (done) => {
            mockRequest.get('/serverError')
                .expect(500)
                .end((err) => {
                    if (err) return done(err);
                    return done();
                });
        });
    });
});
