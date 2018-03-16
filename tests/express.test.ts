import * as request from 'supertest-as-promised';
import * as express from 'express';
const redisMock = require('redis-mock');
import { setLocalHeaders, setBasicSecurity, setBodyParser, setRateLimiter } from '../src/lib/express';

describe('Express', () => {
  describe('#setLocalHeaders', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    test('app should have Access-Control headers', async () => {
      setLocalHeaders(app, '*');
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { headers } = await request(app).get('/');
      expect(headers).toHaveProperty('access-control-allow-origin');
      expect(headers).toHaveProperty('access-control-allow-headers');
      expect(headers).toHaveProperty('access-control-allow-methods');
    });
    test('app should return 204 on OPTIONS call', async () => {
      setLocalHeaders(app, '*');
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { status } = await request(app).options('/');
      expect(status).toEqual(204);
    });
  });

  describe('#setBasicSecurity', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    test('app should have security headers', async () => {
      setBasicSecurity(app, '*');
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { headers } = await request(app).get('/');
      // helmet
      expect(headers).toHaveProperty('x-dns-prefetch-control');
      expect(headers).toHaveProperty('x-frame-options');
      expect(headers).toHaveProperty('x-xss-protection');
      expect(headers).toHaveProperty('x-download-options');
      expect(headers).toHaveProperty('strict-transport-security');

      // cors
      expect(headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('#setBodyParser', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    test('app should have content-type header', async () => {
      setBodyParser(app, '/');
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { headers } = await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });
    test('app should have content-type header (raw)', async () => {
      setBodyParser(app, '/', { raw: { limit: 500 } });
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { headers } = await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });
    test('app should have content-type header (text)', async () => {
      setBodyParser(app, '/', { text: { limit: 500 } });
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { headers } = await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });
  });

  describe('#setRateLimiter', () => {
    let app;
    beforeEach(() => {
      app = express();
    });

    test('set default rateLimiter', async () => {
      setRateLimiter(app, '/');
      app.use('/', (req, res) => res.status(200).send('Welcome'));
    });
    test('rateLimiter should return 429 on too many tries', async () => {
      setRateLimiter(app, '/', { minWait: 5000, freeRetries: 1 });
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { status } = await request(app).get('/');
      expect(status).toEqual(200);
      const { status: status2 } = await request(app).get('/');
      expect(status2).toEqual(200);
      const { status: status3 } = await request(app).get('/');
      expect(status3).toEqual(429);
    });
    test('rateLimiter with custom redisStore', async () => {
      const redisClient = redisMock.createClient();

      setRateLimiter(app, '/', { redis: { client: redisClient } });
      app.use('/', (req, res) => res.status(200).send('Welcome'));

      const { status } = await request(app).get('/');
      expect(status).toEqual(200);
    });
  });
});
