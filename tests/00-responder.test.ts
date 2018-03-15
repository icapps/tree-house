import * as responder from './../src/lib/responder';
const request = require('supertest-as-promised');
const express = require('express');
const app = express();

describe('Responder', () => {
  beforeEach(() => {
    app.use((err, req, res, next) => {
      return res.status(500).json(err.message);
    });
  });

  describe('#handleFn', () => {
    beforeAll(() => {
      const fn = (req, res) => {
        throw new Error('Something went wrong! 💩');
      };
      app.get('/hello', responder.handleAsyncFn(fn));
    });

    test('handleAsyncFn catches error', async () => {
      const { status, body } = await request(app).get('/hello');
      expect(status).toEqual(500);
      expect(body).toEqual('Something went wrong! 💩');
    });
  });

  describe('#handleAsyncFn', () => {
    beforeAll(() => {
      const fn = (req, res) => {
        return new Promise((resolve, reject) => setTimeout(() => {
          reject(new Error('Something went wrong! 💩💩'));
        }, 2000));
      };

      app.get('/helloAsync', responder.handleAsyncFn(fn));
    });

    test('handleAsyncFn catches async error', async () => {
      const { status, body, error } = await request(app).get('/helloAsync');
      expect(status).toEqual(500);
      expect(body).toEqual('Something went wrong! 💩💩');
    });
  });
});
