import { TreeHouse, PassportAuthentication } from 'tree-house';
import { localStrategyConfig, jwtStrategyConfig, onLocalStrategy, onJwtStrategy } from './config/authentication';
import ROUTES from './config/routes';

// Configuration
const APP_CONFIGURATION = {
    port: 5002,
    bodyLimit: '10mb',
    apiKey: 'ga9ul2!dsf321;3122',
    basePath: process.env.BASE_PATH || '/api/v1',
};

function init() {
    // Create the new TreeHouse instance
    const main = new TreeHouse(APP_CONFIGURATION);

    // Passport authentication
    const passportAuthentication = new PassportAuthentication();
    passportAuthentication.setLocalStrategy(localStrategyConfig, onLocalStrategy);
    passportAuthentication.setJwtStrategy(jwtStrategyConfig, onJwtStrategy);

    // Set the correct stuff onto the application instance
    main.setAuthentication(passportAuthentication);
    main.setRoutes(ROUTES);

    // Export the instance to use throughout the project
    module.exports.main = main;

    // Fire up the server
    main.fireUpEngines();
}


// Start the application
init();
