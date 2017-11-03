import validate from 'express-validation';
import { BaseMiddleware } from '../../../../build';

export default class IsValidated extends BaseMiddleware {
  constructor(rules) {
    super();
    this.validator = validate(rules);
  }

  execute(req, res, next) {
    return this.validator(req, res, next);
  }
}
