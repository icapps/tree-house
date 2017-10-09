// Needed for workers/clusters and error handling
import cluster from 'cluster';
import os from 'os';

// HTTP-HTTPS
import http from 'http';
import https from 'https';
import fs from 'fs';

export default class processConfig {
    /**
     * Start the whole server application
     * @param {any} expressInstance
     * @param {any} configuration
     * @returns {any}
     */
    start(expressInstance, configuration) {
        return cluster.isMaster ? this.startMasterCluster(configuration) : this.startHttpServer(expressInstance, configuration);
    }


    /**
     * Start the master cluster with one or multiple workers
     * @param {Object} configuration
     */
    startMasterCluster(configuration) {
        // Number of workers
        const workers = process.env.WORKERS || configuration.workers || os.cpus().length;

        console.log('start cluster with %s workers', workers);
        [workers].forEach(() => {
            const worker = cluster.fork().process;
            console.log('worker %s started.', worker.pid);
        });

        cluster.on('exit', (worker) => {
            console.log('worker %s died. restart...', worker.process.pid);
            cluster.fork();
        });
    }


    /**
     * Start an HTTP/HTTPS server with express and our configuration
     * @param {any} expressInstance
     * @param {any} configuration
     */
    startHttpServer(expressInstance, configuration) {
        const httpServer = http.createServer(expressInstance);
        httpServer.listen(configuration.port);
        console.log(`TreeHouse HTTP NodeJS Server listening on port ${configuration.port}`);

        // HTTPS - Optional
        if (configuration.https) {
            const httpsServer = https.createServer(this.getHttpsCredentials(), expressInstance);
            httpsServer.listen(configuration.https.port);
            console.log(`TreeHouse HTTPS NodeJS Server listening on port ${configuration.https.port}`);
        }
    }


    /**
     * Get HTTPS credentials
     * Read out the private key and certificate
     * @returns {any}
     */
    getHttpsCredentials(configuration) {
        if (configuration.https.privateKey && configuration.https.certificate) {
            try {
                const privateKey = fs.readFileSync(configuration.https.privateKey, 'utf8');
                const certificate = fs.readFileSync(configuration.https.certificate, 'utf8');
                return { key: privateKey, cert: certificate };
            } catch (e) {
                throw new Error(e);
            }
        } else {
            throw new Error('No private key and/or certificate found required for HTTPS server');
        }
    }
}

/**
 * Any uncaught exceptions
 */
process.on('uncaughtException', (error) => {
    console.error(`${(new Date()).toUTCString()} uncaughtException:${error.message}`);
    console.error(error.stack);
    process.exit(1);
});
