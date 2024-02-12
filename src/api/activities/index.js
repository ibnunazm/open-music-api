const ActivitiesHandler = require("./handler");
const routes = require("./routes");
const registerActivities = {
  name: "activity",
  version: "1.0.0",
  register: (server, { activitiesService, playlistsService }) => {
    const activitiesHandler = new ActivitiesHandler(
      activitiesService,
      playlistsService
    );
    server.route(routes(activitiesHandler));
  },
};

module.exports = registerActivities;
