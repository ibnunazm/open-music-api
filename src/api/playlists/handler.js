const { mapAlbumSongs } = require("../../utils/index");

class PlaylistHandler {
  constructor(playlistsService, songsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    this.addPlaylistHandler = this.addPlaylistHandler.bind(this);
    this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.getPlaylistWithSongsHandler = this.getPlaylistWithSongsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async addPlaylistHandler(req, h) {
    await this._validator.validatePayloadPlaylist(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    const id = await this._playlistsService.addPlaylist(name, credentialId);

    const response = h.response({
      status: "success",
      data: {
        playlistId: id,
      },
    });
    response.code(201);
    return response;
  }

  async addSongToPlaylistHandler(req, h) {
    await this._validator.validatePayloadSongToPlaylist(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { id: playlistId } = req.params;
    const { songId } = req.payload;
    await this._songsService.verifySong(songId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);
    await this._activitiesService.addNewActivities(
      playlistId,
      songId,
      credentialId,
      "add"
    );
    const response = h.response({
      status: "success",
      message: "song has been added to the album",
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlist = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: "success",
      data: {
        playlists: playlist,
      },
    };
  }

  async getPlaylistWithSongsHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const data = await this._playlistsService.getPlaylistWithSongs(playlistId);
    const newDataSongs =
      data[0].song_id !== null ? await data.map(mapAlbumSongs) : [];
    return {
      status: "success",
      data: {
        playlist: {
          id: data[0].playlist_id,
          name: data[0].playlist_name,
          username: data[0].username,
          songs: newDataSongs,
        },
      },
    };
  }

  async deletePlaylistHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylist(playlistId);

    return {
      status: "success",
      message: "playlist has been deleted",
    };
  }

  async deleteSongFromPlaylistHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._validator.validatePayloadSongToPlaylist(req.payload);
    const { songId } = req.payload;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);
    await this._activitiesService.addNewActivities(
      playlistId,
      songId,
      credentialId,
      "delete"
    );
    return {
      status: "success",
      message: "song has been deleted from playlist",
    };
  }
}

module.exports = PlaylistHandler;
