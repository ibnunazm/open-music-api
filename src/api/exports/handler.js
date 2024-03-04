const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');

class ExportHandler {
  constructor(ExportService, PlaylistService, validator) {
    this._exportService = ExportService;
    this._playlistService = PlaylistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportHandler(req, h) {
    if (req.payload.targetEmail == undefined) {
      throw new InvariantError('email address must be fill');
    }
    await this._validator.validateExportPayload(req.payload);
    const { targetEmail } = req.payload;
    const { playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const message = {
      playlistId: playlistId,
      targetEmail: targetEmail,
    };
    await this._exportService.sendMessage('exports:playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
