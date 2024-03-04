const Joi = require('joi');

const ExportSchemaValidation = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportSchemaValidation };
