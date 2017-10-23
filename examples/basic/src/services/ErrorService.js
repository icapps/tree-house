import { BaseService, TreeError } from '../../../../build';

export default class ErrorService extends BaseService {
  unauthorisedAccess() {
    throw new TreeError.Unauthorised('You are sooooo not authorised!');
  }

  badRequest() {
    throw new TreeError.BadRequest('This is a very very bad request!');
  }
}
