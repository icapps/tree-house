import * as request from 'supertest';
import * as express from 'express';
import { setSwagger } from '../../src';
const app = express();

describe('Swagger', () => {
  describe('#setSwagger', () => {
    it('successfully open swagger', async () => {
      setSwagger(app, '/documentation', './tests/assets/docs.yml');
      const { status } = await request(app).get('/documentation');
      expect(status).toEqual(301);
    });

    it('throws error on invalid filepath', async () => {
      expect.assertions(2);
      try {
        setSwagger(app, '/documentation', '../random/docs.yml');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Failed to load swagger documentation');
      }
    });

    it('Should throw an error when you did not put concatenate on true and path is folder', () => {
      expect.assertions(2);
      try {
        setSwagger(app, '/documentation', './tests/assets/docsFolder');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // tslint:disable-next-line:max-line-length
        expect(error.message).toEqual('Failed to load swagger documentation: Error: To concatenate a folder of swagger YMLS, you need to explicitly set the boolean concatenate on true for the swaggerOptions');
      }
    });

    it('Should throw an error when concatenate boolean = true and given path is a file', () => {
      expect.assertions(2);
      try {
        setSwagger(app, '/documentation', './tests/assets/docs.yml', { concatenate: true });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        // tslint:disable-next-line:max-line-length
        expect(err.message).toEqual('Failed to load swagger documentation: Error: Boolean concatenate cannot be true when you specify a file. When you want to concatenate, specify a folder');
      }
    });

    it('Should throw error when filepath is directory and directory contains no index.yml file', () => {
      expect.assertions(2);
      try {
        setSwagger(app, '/documentation', './tests/assets/docsFolder', { concatenate : true });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Could not read index.yml make sure the file is named: index.yml and in the correct folder');
      }
    });

    it('Should throw an error when docsFolder does not contain a routes folder', () => {
      expect.assertions(2);
      try {
        setSwagger(app, '/documentation', './tests/assets/almostValidDocsFolder', { concatenate : true });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error while reading routes folder. Make sure there is one!');
      }
    });

    it('Should sucesfully create swagger documentation when filepath is a folder and resources are valid', async () => {
      setSwagger(app, '/documentation', './tests/assets/validDocsFolder', { concatenate : true });
      const { status } = await request(app).get('/documentation');
      expect(status).toEqual(301);
    });
  });
});
