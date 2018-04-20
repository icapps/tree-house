import * as express from 'express';
import * as request from 'supertest';
import { startServer } from '../src';

// CONSTANTS
const CONFIGURATION = {
  port: 4000,
};

describe('Initialise things before running application', () => {
  describe('#startServer', () => {
    let app;

    beforeEach(() => {
      app = express();
    });

    test('should start http server', async () => {
      startServer(app, CONFIGURATION);

      app.use('/', (req, res) => res.json('welcome'));
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
    });


    test('should start http server with provided callbackFn', async () => {
      const mockFn = jest.fn();
      startServer(app, { port: 5003 }, mockFn);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
