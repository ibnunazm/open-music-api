const AlbumsHandler = require("./handler");
const routes = require("./routes");

const registerAlbum = {
  name: "album",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumsHandler(service, validator);
    server.route(routes(albumHandler));
  },
};

module.exports = registerAlbum;
