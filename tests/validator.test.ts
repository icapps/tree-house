import * as request from 'supertest';
import * as express from 'express';
import * as Joi from 'joi';
import { validateSchema, setBodyParser } from './../src';
const app = express();

describe('Validator', () => {
  describe('#validateSchema', () => {
    setBodyParser(app, '*'); // Needed for req.body
    const schema = {
      body: {
        name: Joi.string().required(),
      },
    };

    const respond = (_req, res) => res.status(200).send({});
    app.post('/validateTest', validateSchema(schema), respond);

    it('Should succesfully validate schema', async () => {
      const { body, status } = await request(app)
        .post('/validateTest')
        .send({ name: 'Brent' });

      expect(status).toEqual(200);
    });

    it('Should throw error when data is invalid', async () => {
      const { body, status } = await request(app)
        .post('/validateTest')
        .send({ unknownProperty: 'Brent' });

      expect(status).toEqual(400);
    });

    it('Should throw error when data is not provided', async () => {
      const { body, status } = await request(app)
        .post('/validateTest')
        .send({});

      expect(status).toEqual(400);
    });
  });
});

