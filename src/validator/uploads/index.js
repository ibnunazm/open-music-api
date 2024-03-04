const { UploadSchemaValidator } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
const uploadValidation = {
  validateUploadPayload: async (payload) => {
    const validateResult = UploadSchemaValidator.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = uploadValidation;
