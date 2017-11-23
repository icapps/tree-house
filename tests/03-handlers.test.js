import ErrorHandler from '../src/lib/handlers/errorHandler';
import ResponseHandler from '../src/lib/handlers/responseHandler';
import UnauthorisedError from '../src/lib/errors/unauthorised';

const MockExpressResponse = require('mock-express-response');
const MockExpressRequest = require('mock-express-request');

describe('#Handlers', () => {
  test('Should return a valid error via next function', () => {
    const errorHandler = new ErrorHandler();
    const mockError = new Error('Something went wrong');

    errorHandler.execute(mockError, new MockExpressRequest(), new MockExpressResponse(), (error) => {
      expect(error).toEqual(mockError);
    });
  });

  test('Should return a valid tree error via response', () => {
    const errorHandler = new ErrorHandler();
    const unauthorisedError = new UnauthorisedError('NOT_AUTH', 'You are not authorised');
    const response = new MockExpressResponse();

    errorHandler.execute(unauthorisedError, new MockExpressRequest(), response);

    expect(response._getJSON()).toEqual({
      errorMessage: 'You are not authorised',
      errorCode: 'NOT_AUTH',
    });
  });

  test('Should return a valid express response', () => {
    const responseHandler = new ResponseHandler();
    const response = new MockExpressResponse();
    const dataToReturn = { data: 'MyDataToSend' };

    responseHandler.execute(response, dataToReturn);

    expect(response._getJSON()).toEqual(dataToReturn);
  });
});
