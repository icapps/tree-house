import * as request from 'supertest';
import * as express from 'express';
import { setSwagger } from './../src';
const app = express();

describe('Swagger', () => {
  describe('#setSwagger', () => {
    test('successfully open swagger', async () => {
      setSwagger(app, '/documentation', './tests/assets/docs.yml');
      const { status } = await request(app).get('/documentation');
      expect(status).toEqual(301);
    });

    test('throws error on invalid filepath', async () => {
      expect.assertions(2);
      try {
        setSwagger(app, '/documentation', '../random/docs.yml');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Failed to load swagger documentation');
      }
    });
  });
});
