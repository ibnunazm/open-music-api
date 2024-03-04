const likesRoutes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikesAlbum,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getCountLikesAlbum,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteLikesAlbum,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = likesRoutes;
