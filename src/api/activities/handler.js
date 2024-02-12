class ActivitiesHandler {
  constructor(ActivitiesService, PlaylistsService) {
    this._activitiesService = ActivitiesService;
    this._playlistsService = PlaylistsService;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._activitiesService.getActivities(playlistId);
    const dataActivities = await this._activitiesService.getActivities(
      playlistId
    );

    return {
      status: "success",
      data: {
        playlistId: playlistId,
        activities: dataActivities,
      },
    };
  }
}

module.exports = ActivitiesHandler;
