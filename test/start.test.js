import { should, expect } from 'chai';
import { TreeHouse, PassportAuthentication, Cipher } from '../src/index';
import { localStrategyConfig, jwtStrategyConfig, onLocalStrategy, onJwtStrategy } from './authentication.config';

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
let newApplication = null;
let authentication = null;

describe('New instance of a TreeHouse server', () => {
    describe('Initial setup', () => {
        it('Create new instance with the provided configuration', () => {
            newApplication = new TreeHouse(CONFIGURATION);
            newApplication.configuration.should.equal(CONFIGURATION);
        });

        it('Set Passport authentication', () => {
            authentication = new PassportAuthentication(localStrategyConfig, jwtStrategyConfig);
            authentication.setLocalStrategy(onLocalStrategy);
            authentication.setJwtStrategy(onJwtStrategy);

            const webtoken = authentication.getJwtToken(user);
            return expect(webtoken).not.to.be.empty;
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
});