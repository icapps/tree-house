import BaseController from '../src/lib/base/baseController';
import ResponseHandler from '../src/lib/handlers/responseHandler';

const MockExpressResponse = require('mock-express-response');

describe('#Base classes', () => {
  test('Should return a new BaseController instance', () => {
    const baseController = new BaseController();
    expect(baseController).toHaveProperty('responseHandler');
    expect(baseController.responseHandler).toBeInstanceOf(ResponseHandler);
  });

  test('Should execute extending from baseController', async () => {
    const baseController = new BaseController();
    const response = new MockExpressResponse();

    const valueToReturn = { data: 'MyMockValue' };
    await baseController.execute(response, jest.fn().mockReturnValue(valueToReturn)());

    expect(response._getJSON()).toEqual(valueToReturn);
  });

  test('Should throw an error extending from baseController', async () => {
    const baseController = new BaseController();
    const response = new MockExpressResponse();

    return expect(baseController.execute(response, () => {
      throw new Error('MyError');
    })).rejects;
  });
});
