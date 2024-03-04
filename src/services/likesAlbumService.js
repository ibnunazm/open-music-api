const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class LikesAlbumService {
  constructor(CacheService) {
    this._pool = new Pool();
    this._cacheService = CacheService;
  }

  async postLikesAlbum(albumId, userId) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO likes_album VALUES($1,$2,$3) RETURNING id",
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("data gagal ditambahkan");
    }

    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async getCountLikesAlbum(albumId) {
    try {
      const result = await this._cacheService.get(`album_id:${albumId}`);
      return [JSON.parse(result), true];
    } catch (error) {
      const query = {
        text: "SELECT * FROM likes_album WHERE album_id = $1",
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(
        `album_id:${albumId}`,
        JSON.stringify(result.rowCount)
      );
      return [result.rowCount, false];
    }
  }

  async deleteLikesAlbum(albumId, userId) {
    const query = {
      text: "DELETE FROM likes_album WHERE user_id = $1 AND album_id = $2 returning id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("data gagal di hapus, tidak ditemukan");
    }
    await this._cacheService.delete(`album_id:${albumId}`);
  }

  async verifyLikes(albumId, userId) {
    const query = {
      text: "SELECT * FROM likes_album WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError("album sudah disukai");
    }
  }
}

module.exports = LikesAlbumService;
