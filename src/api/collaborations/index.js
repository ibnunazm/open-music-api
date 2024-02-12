const CollaborationsHandler = require("./handler");
const routes = require("./routes");
const registerCollab = {
  name: "collaboration",
  version: "1.0.0",
  register: (
    server,
    { playlistsService, collaborationsService, validator }
  ) => {
    const collabHandler = new CollaborationsHandler(
      playlistsService,
      collaborationsService,
      validator
    );
    server.route(routes(collabHandler));
  },
};

module.exports = registerCollab;
