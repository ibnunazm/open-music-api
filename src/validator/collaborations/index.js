const InvariantError = require("../../exceptions/InvariantError");
const { CollaborationSchemaValidator } = require("./schema");

const CollaborationValidator = {
  validatePayloadCollaboration: (payload) => {
    const validateResult = CollaborationSchemaValidator.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = CollaborationValidator;
