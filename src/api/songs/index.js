const SongsHandler = require("./handler");
const routes = require("./routes");

const registerSong = {
  name: "song",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const songHandler = new SongsHandler(service, validator);
    server.route(routes(songHandler));
  },
};

module.exports = registerSong;
