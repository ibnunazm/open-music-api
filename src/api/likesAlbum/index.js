const LikesAlbumHandler = require('./handler');
const routes = require('./routes');

const registerLikes = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { LikesAlbumService, AlbumsService }) => {
    const likesAlbumHandler = new LikesAlbumHandler(LikesAlbumService, AlbumsService);
    server.route(routes(likesAlbumHandler));
  },
};

module.exports = registerLikes;
