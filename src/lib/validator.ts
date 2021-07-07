import * as expressValidation from 'express-validation';

/**
 * Validate a Joi schema via express-validation
 */
export function validateSchema(schema, options: expressValidation.EvOptions = {}) {
  return function (req, res, next) {
    try {
      expressValidation.validate(schema, options)(req, res, next);
    } catch (err) {
      throw err;
    }
  };
}
