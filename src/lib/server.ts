import { Application } from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';


/**
 * Start an http/https server from the given Express instance
 */
export function startServer(app: Application, options: ServerOptions): void {
  const httpServer = http.createServer(app);
  httpServer.listen(options.port);
  console.log(`${options.title || 'TreeHouse'} HTTP NodeJS Server listening on port ${options.port}`);

  // HTTPS - Optional
  if (options.https) {
    const httpsServer = https.createServer(getHttpsCredentials(options.https.certificate, options.https.privateKey), app);
    httpsServer.listen(options.https.port);
    console.log(`${options.title || 'TreeHouse'} HTTPS NodeJS Server listening on port ${options.https.port}`);
  }
}


/**
 * Get HTTPS credentials
 * Read out the private key and certificate
 */
function getHttpsCredentials(certificate: string, privateKey: string): { key: string, cert: string } {
  try {
    const key = fs.readFileSync(privateKey, 'utf8');
    const cert = fs.readFileSync(certificate, 'utf8');
    return { key, cert };
  } catch (e) {
    throw new Error(`Something went wrong while fetching keys: ${e}`);
  }
}


export interface ServerOptions {
  port: number;
  title?: string;
  https?: {
    port: number;
    privateKey: string;
    certificate: string;
  };
}


