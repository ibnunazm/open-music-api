const autoBind = require("auto-bind");
class UploadHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async uploadFileCover(req, h) {
    const { cover } = req.payload;
    await this._validator.validateUploadPayload(cover.hapi.headers);
    const { id: albumId } = req.params;
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._albumsService.updateAlbumCoverById(albumId, filename);
    

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadHandler;
