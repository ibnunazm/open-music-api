const autoBind = require("auto-bind");
const { mapAlbumSongs } = require("../../utils");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async addAlbumHandler(req, h) {
    await this._validator.validatePayloadAlbum(req.payload);

    const id = await this._service.addAlbum(req.payload);
    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(req, h) {
    const { id } = req.params;

    const data = await this._service.getAlbumById(id);

    const newDataSongs =
      data[0].song_id !== null ? await data.map(mapAlbumSongs) : [];
    const coverUrl =
      data[0].cover !== null
        ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${data[0].cover}`
        : null;
    const response = h.response({
      status: "success",
      data: {
        album: {
          id: data[0].album_id,
          name: data[0].album_name,
          year: data[0].album_year,
          coverUrl: coverUrl,
          songs: newDataSongs,
        },
      },
    });

    response.code(200);
    return response;
  }

  async updateAlbumByIdHandler(req, h) {
    const { id } = req.params;
    await this._validator.validatePayloadAlbum(req.payload);
    await this._service.updateAlbumById(id, req.payload);

    const response = h.response({
      status: "success",
      message: "Album berhasil di perbaharui",
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(req, h) {
    const { id } = req.params;

    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: "success",
      message: "Album berhasil di hapus",
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
