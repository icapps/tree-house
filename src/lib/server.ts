import { Application } from 'express';

export function startServer(app: Application, options: ServerOptions, callbackFn?: Function): void {
  app.listen(options.port, () => {
    console.log(`${options.title || 'TreeHouse'} NodeJS Server listening on port ${options.port}`);
  });

  if (callbackFn) callbackFn(); // Optional callback
}

// Interfaces
export interface ServerOptions {
  port: number;
  title?: string;
}


