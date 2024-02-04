const ClientError = require("../../exceptions/ClientError");
const { SongSchemaValidator, QuerySchemaValidator } = require("./schema");

const songValidation = {
  validatePayloadSong: (payload) => {
    const validationResult = SongSchemaValidator.validate(payload);

    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    } else {
      payload.albumId = "null";
    }
  },
  validateQuerySearch: (query) => {
    const validationResult = QuerySchemaValidator.validate(query);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = songValidation;
