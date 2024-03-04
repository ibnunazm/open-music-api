const { ExportSchemaValidation } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
const ExportValidator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportSchemaValidation.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportValidator;
