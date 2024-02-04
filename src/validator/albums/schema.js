const Joi = require('joi');

const AlbumSchemaValidator = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { AlbumSchemaValidator };
