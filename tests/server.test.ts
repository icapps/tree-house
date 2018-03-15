import { startServer } from '../src/lib/server';
const request = require('supertest-as-promised');
const express = require('express');

// CONSTANTS
const CONFIGURATION = {
  port: 3000,
  https: {
    certificate: 'tests/assets/test-ssl.cert',
    privateKey: 'tests/assets/test-ssl.key',
    port: 3001,
  },
};

describe('Initialise things before running application', () => {
  describe('#startServer', () => {
    let app;
    beforeEach(() => {
      app = express();
    });
    test('start http server', async () => {
      startServer(app, CONFIGURATION);

      app.use('/', (req, res) => res.json('welcome'));
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
    });
    test('start http server should throw error on invalid https configuration', async () => {
      const WRONG_CONFIGURATION = Object.assign({}, CONFIGURATION, {
        title: 'Tree House',
        port: 5000,
        https: {
          certificate: 'test/assets/random.cert',
          privateKey: 'test/assets/random.key',
        },
      });
      expect.assertions(2);
      try {
        startServer(app, WRONG_CONFIGURATION);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Something went wrong while fetching keys');
      }
    });
  });
});
