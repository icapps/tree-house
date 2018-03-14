
import { TreeHouse } from '../../../build';
import ROUTES from './config/routes';

// Configuration
const APP_CONFIGURATION = {
    port: 5002,
    bodyLimit: '10mb',
    apiKey: 'ga9ul2!dsf321;3122',
    basePath: process.env.BASE_PATH || '/api/v1',
    title: 'Basic example',
};

function init() {
    // Create the new TreeHouse instance
    const app = new TreeHouse(APP_CONFIGURATION);

    // Set the correct stuff onto the application instance
    app.setRoutes(ROUTES);

    app.setDocumentation('/documentation', 'documentation/swagger.yml');

    // Fire up the server
    app.fireUpEngines();

    // Export the instance to use throughout the project
    module.exports.app = app;
}


// Start the application
init();
