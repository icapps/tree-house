import * as Joi from 'joi';

// Joi validation schem
const addUserBody = {
  body: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
};

export default addUserBody;
