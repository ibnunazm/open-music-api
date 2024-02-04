const Joi = require('joi');

const SongSchemaValidator = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string().allow(null).default(null),
});

const QuerySchemaValidator = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty(''),
});

module.exports = {
  SongSchemaValidator,
  QuerySchemaValidator,
};
