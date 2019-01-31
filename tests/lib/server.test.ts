import * as express from 'express';
import * as request from 'supertest';
import { startServer } from '../../src';

// CONSTANTS
const CONFIGURATION = {
  port: 4000,
  https: {
    certificate: 'tests/assets/test-ssl.cert',
    privateKey: 'tests/assets/test-ssl.key',
    port: 4001,
  },
};

describe('Initialise things before running application', () => {
  describe('#startServer', () => {
    let app;

    beforeEach(() => {
      app = express();
    });

    test('should start http server', async () => {
      startServer(app, CONFIGURATION);

      app.use('/', (_req, res) => res.json('welcome'));
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
    });

    test('should start http server with provided pre-hook', async () => {
      const mockFn = jest.fn();
      await startServer(app, { port: 5003, pre: mockFn });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should throw an error when error occurs in the provided pre-hook', async () => {
      const mockFn = jest.fn(() => { throw new Error('myPreHookError'); });
      expect.assertions(2);
      try {
        await startServer(app, { port: 6001, pre: mockFn });
      } catch (error) {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual('myPreHookError');
      }
    });

    test('should start http server with provided post-hook', async () => {
      const mockFn = jest.fn();
      await startServer(app, { port: 5004, post: mockFn });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should throw an error when error occurs in the provided post-hook', async () => {
      const mockFn = jest.fn(() => { throw new Error('myPostHookError'); });
      expect.assertions(2);
      try {
        await startServer(app, { port: 5005, post: mockFn });
      } catch (error) {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual('myPostHookError');
      }
    });

    test('start http server should throw error on invalid https configuration', async () => {
      const WRONG_CONFIGURATION = Object.assign({}, CONFIGURATION, {
        title: 'Tree House',
        port: 5000,
        https: {
          port: 5001,
          certificate: 'test/assets/random.cert',
          privateKey: 'test/assets/random.key',
        },
      });
      expect.assertions(2);

      try {
        await startServer(app, WRONG_CONFIGURATION);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Something went wrong while fetching keys');
      }
    });
  });
});
