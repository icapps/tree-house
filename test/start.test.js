import { should } from 'chai';
import { TreeHouse, PassportAuthentication as Authentication } from '../src/index';

should();

// CONSTANTS
const CONFIGURATION = {
    port: 5000,
    bodyLimit: '10mb',
    apiKey: 'ga9ul2!MN36nyh64z4d5SC70jv-YJV:c0XzN8be}_I24j0qYjs*%zCb01CaHCm6U_S',
    basePath: process.env.BASE_PATH || '/api/v1',
};
let newApplication = null;
let authentication = null;

describe('New instance of a TreeHouse server', () => {
    describe('Initial setup', () => {
        it('Create new instance with the provided configuration', () => {
            newApplication = new TreeHouse(CONFIGURATION);
            newApplication.configuration.should.equal(CONFIGURATION);
        });

        it('', () => {
            // Use the provided Passport authenticator (You can create a custom one if wanted)
            // authentication = new Authentication(localStrategyConfig, jwtStrategyConfig);
            // authentication.setLocalStrategy(onLocalStrategy);
            // authentication.setJwtStrategy(onJwtStrategy);
        });

        it('', () => {
            // newApplication.setRoutes(ROUTES);
            // newApplication.setAuthentication(authentication);
        });

        it('Fire up the application', () => {
            newApplication.fireUpEngines();
        });
    });
});
