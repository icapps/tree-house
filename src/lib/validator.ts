import * as expressValidation from 'express-validation';

/**
 * Validate a Joi schema via express-validation
 */
export function validateSchema(schema, options = {}) {
  return function (req, res, next) {
    const allOptions = Object.assign({}, {
      allowUnknownBody: false,
      allowUnknownParams: false,
    }, options);

    expressValidation.options(allOptions);
    expressValidation(schema)(req, res, next);
  };
}

