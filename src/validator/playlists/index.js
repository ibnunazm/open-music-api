const InvariantError = require("../../exceptions/InvariantError");
const {
  PlaylistSchemaValidator,
  SongToPlaylistSchemaValidator,
} = require("./schema");

const PlaylistValidator = {
  validatePayloadPlaylist: (payload) => {
    const validateResult = PlaylistSchemaValidator.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validatePayloadSongToPlaylist: (payload) => {
    const validateResult = SongToPlaylistSchemaValidator.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
