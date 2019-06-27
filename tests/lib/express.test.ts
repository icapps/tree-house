import * as request from 'supertest';
import * as express from 'express';
const redisMock = require('redis-mock');
import { setBasicSecurity, setBodyParser, getRateLimiter } from '../../src';

describe('Express', () => {
  describe('#setBasicSecurity', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
    });

    it('app should have security headers', async () => {
      setBasicSecurity(app, '*');
      app.use('/', (_req, res) => res.status(200).send('Welcome'));

      const { headers } = <any>await request(app).get('/');

      // helmet
      expect(headers).toHaveProperty('x-dns-prefetch-control');
      expect(headers).toHaveProperty('x-frame-options');
      expect(headers).toHaveProperty('x-xss-protection');
      expect(headers).toHaveProperty('x-download-options');
      expect(headers).toHaveProperty('strict-transport-security');

      // Safari bugfix for sessions
      expect(headers).toHaveProperty('credentials', 'include');

      // cors
      expect(headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('#setBodyParser', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
    });

    it('app should have content-type header', async () => {
      setBodyParser(app, '/');
      app.use('/', (_req, res) => res.status(200).send('Welcome'));

      const { headers } = <any>await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });

    it('app should have content-type header (raw)', async () => {
      setBodyParser(app, '/', { raw: { limit: 500 } });
      app.use('/', (_req, res) => res.status(200).send('Welcome'));

      const { headers } = <any>await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });

    it('app should have content-type header (json)', async () => {
      setBodyParser(app, '/', { json: { limit: 500 } });
      app.use('/', (_req, res) => res.status(200).json({ name: 'Welcome' }));

      const { headers } = <any>await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });

    it('app should have content-type header (urlEncoded)', async () => {
      setBodyParser(app, '/', { json: { limit: 500 } });
      app.use('/', (_req, res) => res.status(200).send(encodeURI('Welcome')));

      const { headers } = <any>await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });

    it('app should have content-type header (text)', async () => {
      setBodyParser(app, '/', { text: { limit: 500 } });
      app.use('/', (_req, res) => res.status(200).send('Welcome'));

      const { headers } = <any>await request(app).get('/');
      expect(headers).toHaveProperty('content-type');
    });
  });

  describe('#getRateLimiter', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
    });

    it('set default rateLimiter', async () => {
      const rateLimiter = getRateLimiter();
      app.use('/', rateLimiter, (_req, res) => res.status(200).send('Welcome'));
    });

    it('rateLimiter should return 429 on too many tries', async () => {
      const rateLimiter = getRateLimiter({ max: 2 });
      app.use('/', rateLimiter, (_req, res) => res.status(200).send('Welcome'));

      const { status } = await request(app).get('/');
      expect(status).toEqual(200);

      const { status: status2 } = await request(app).get('/');
      expect(status2).toEqual(200);

      const { status: status3 } = await request(app).get('/');
      expect(status3).toEqual(429);
    });

    it('rateLimiter with custom redisStore', async () => {
      const redisClient = redisMock.createClient();

      const rateLimiter = getRateLimiter({ redis: { client: redisClient } });
      app.use('/', rateLimiter, (_req, res) => res.status(200).send('Welcome'));

      const { status } = await request(app).get('/');
      expect(status).toEqual(200);
    });
  });
});
