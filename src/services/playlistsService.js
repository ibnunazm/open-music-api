const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");
const { nanoid } = require("nanoid");

class PlaylistsService {
  constructor(CollaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = CollaborationsService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("data gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_fk-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1,$2,$3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("data gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN users ON playlists.owner = users.id
        WHERE playlists.owner = $1
        UNION
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN collaborations ON playlists.id = collaborations."playlistId"
        LEFT JOIN users ON playlists.owner = users.id
        WHERE collaborations."userId" = $1;
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }

  async getPlaylistWithSongs(id) {
    const query = {
      text: `SELECT
      p.id as playlist_id,
      p.name as playlist_name,
      u.username as username,
      s.id as song_id,
      s.title as song_title,
      s.performer as song_performer
    FROM
        playlist_songs ps
    LEFT JOIN
        songs s ON ps."songId" = s.id
    LEFT JOIN
        playlists p ON ps."playlistId" =  p.id
    LEFT JOIN
        users u ON p.owner =  u.id
    WHERE
        ps."playlistId" = $1
  `,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("data tidak ditemukan");
    }

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("gagal menghapus, data tidak ditemukan.");
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE "songId" = $1 AND "playlistId" = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("gagal menghapus, data tidak ditemukan.");
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("playlist tidak ditemukan");
    }

    const owner_playlist = result.rows[0].owner;
    if (owner_playlist !== userId) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
