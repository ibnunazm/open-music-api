const { AuthSchemaValidator, RefreshTokenVallidator } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const AuthValidator = {
  validatePayloadAuthentications: (payload) => {
    const validateResult = AuthSchemaValidator.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validateRefreshToken: (payload) => {
    const validateResult = RefreshTokenVallidator.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = AuthValidator;
