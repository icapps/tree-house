import setSwagger from './../src/lib/swagger';
const request = require('supertest-as-promised');
const express = require('express');
const app = express();

describe('Swagger', () => {
  describe('#setSwagger', () => {
    test('successfully open swagger', async () => {
      setSwagger(app, '/documentation', './tests/assets/docs.yml');
      const { status } = await request(app).get('/documentation');
      expect(status).toEqual(301);
    });

    test('throws error on invalid filepath', async () => {
      try {
        setSwagger(app, '/documentation', '../random/docs.yml');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
