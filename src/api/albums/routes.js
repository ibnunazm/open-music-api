const albumRoutes = (handler) => [
  {
    method: "GET",
    path: "/albums",
    handler: handler.getAllAlbumsHandler,
  },
  {
    method: "POST",
    path: "/albums",
    handler: handler.addAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.updateAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = albumRoutes;
