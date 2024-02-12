const UserHandler = require("./handler");
const routes = require("./routes");
const registerUser = {
  name: "user",
  version: "1.0.0",
  register: (server, { usersService, validator }) => {
    const userHandler = new UserHandler(usersService, validator);
    server.route(routes(userHandler));
  },
};

module.exports = registerUser;
