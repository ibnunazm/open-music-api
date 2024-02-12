const AuthHandler = require("./handler");
const routes = require("./routes");

const registerAuth = {
  name: "auth",
  version: "1.0.0",
  register: (server, { authService, userService, tokenManager, validator }) => {
    const authHandler = new AuthHandler(
      authService,
      userService,
      tokenManager,
      validator
    );
    server.route(routes(authHandler));
  },
};

module.exports = registerAuth;
