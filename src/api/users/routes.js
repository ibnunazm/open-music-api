const userRoutes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.addUserHandler,
  },
];

module.exports = userRoutes;
