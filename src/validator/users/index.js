const { UserSchemaValidator } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const UserValidator = {
  validateUserPayload: (payload) => {
    const validateResult = UserSchemaValidator.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = UserValidator;
