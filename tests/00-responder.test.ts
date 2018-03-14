const mockExpressResponse = require('mock-express-response');
const mockExpressRequest = require('mock-express-request');
import * as responder from './../src/lib/responder';
const request = require('supertest-as-promised');
const express = require('express');
const app = express();

describe('Responder', () => {
  beforeEach(() => {
    const mockReq = new mockExpressRequest();
    const mockRes = new mockExpressResponse();
    const fn = (req, res, err) => { console.log(err); };

    app.use('/', (req, res, next) => responder.handleAsyncFn(fn));
    app.get('/hello', (req, res) => {
      return res.send('hallo');
    });
  });

  describe('#success', () => {
    test('test 1', async () => {
      await request(app).get('/hello').expect((res) => {
        console.log('res', res);
      });
    });
  });
});
