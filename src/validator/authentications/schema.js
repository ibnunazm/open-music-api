const Joi = require("joi");

const AuthSchemaValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const RefreshTokenVallidator = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { AuthSchemaValidator, RefreshTokenVallidator };
