const Joi = require("joi");

const PlaylistSchemaValidator = Joi.object({
  name: Joi.string().required(),
});

const SongToPlaylistSchemaValidator = Joi.object({
  songId: Joi.string().required(),
});
module.exports = { PlaylistSchemaValidator, SongToPlaylistSchemaValidator };
