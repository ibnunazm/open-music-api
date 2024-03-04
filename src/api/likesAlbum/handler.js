const autoBind = require("auto-bind");

class LikesAlbumHandler {
  constructor(LikesAlbumService, AlbumsService) {
    this._likesAlbumService = LikesAlbumService;
    this._albumsService = AlbumsService;
    autoBind(this);
  }

  async postLikesAlbum(req, h) {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials;
    await this._albumsService.verifyIfExistAlbum(albumId);
    await this._likesAlbumService.verifyLikes(albumId, userId);
    await this._likesAlbumService.postLikesAlbum(albumId, userId);

    const response = h.response({
      status: "success",
      message: "album berhasil disukai",
    });
    response.code(201);
    return response;
  }

  async getCountLikesAlbum(req, h) {
    const { id: albumId } = req.params;
    const count = await this._likesAlbumService.getCountLikesAlbum(albumId);
    const likes = parseInt(count[0]);
    const cache = count[1];

    const response = h.response({
      status: "success",
      data: {
        likes: likes,
      },
    });

    if (cache) {
      response.header("X-Data-Source", "cache");
    }

    response.code(200);
    return response;
  }

  async deleteLikesAlbum(req) {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials;
    await this._likesAlbumService.deleteLikesAlbum(albumId, userId);

    return {
      status: "success",
      message: "album batal disukai",
    };
  }
}

module.exports = LikesAlbumHandler;
