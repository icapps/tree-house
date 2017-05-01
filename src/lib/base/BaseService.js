import ServerError from '../errors/ServerError';
import Unauthorised from '../errors/Unauthorised';
import BadRequest from '../errors/BadRequest';

// TODO: Set an array/object of errors (this way custom errors can be added if wanted)
export default class BaseService {
    constructor() {
        // Define all errors needed in the services with inheritance to BaseService
        this.ServerError = ServerError;
        this.Unauthorised = Unauthorised;
        this.BadRequest = BadRequest;
    }
}
