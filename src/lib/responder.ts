import { RequestHandler, Request, Response, NextFunction } from 'express';


/**
 * Wrap an express function to handle unhandled exceptions
 */
export function handleAsyncFn(fnToExecute: (request: Request, response: Response, next?: NextFunction) => Promise<void>): RequestHandler {
  return async (request, response, next) => {
    try {
      await fnToExecute(request, response, next);
    } catch (error) {
      return next(error);
    }
  };
}

