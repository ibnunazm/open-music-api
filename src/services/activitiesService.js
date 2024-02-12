const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addNewActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1,$2,$3,$4,$5) RETURNING id",
      values: [id, playlistId, songId, userId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("failed to add new activity into this playlist");
    }
    return result.rows[0].id;
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT  u.username, s.title, a.action, a.time
      FROM playlist_song_activities a
      LEFT JOIN playlists p ON a."playlistId" = p.id
      LEFT JOIN users u ON a."userId" = u.id
      LEFT JOIN songs s ON a."songId" = s.id
      WHERE a."playlistId" = $1`,

      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError("data tidak ditemukan");
    }

    return result.rows;
  }
}

module.exports = ActivitiesService;
