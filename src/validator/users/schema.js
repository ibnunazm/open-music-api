const Joi = require("joi");

const UserSchemaValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { UserSchemaValidator };
