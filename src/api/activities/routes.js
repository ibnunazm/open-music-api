const activitiesPlaylist = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getActivitiesHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = activitiesPlaylist;
