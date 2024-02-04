const { AlbumSchemaValidator } = require('./schema.js');
const ClientError = require('../../exceptions/ClientError.js');

const albumValidation = {
  validatePayloadAlbum: (payload) => {
    const validationResult = AlbumSchemaValidator.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = albumValidation;
