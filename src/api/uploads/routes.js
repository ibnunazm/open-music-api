const path = require('path');

const uploadRoutes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.uploadFileCover,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = uploadRoutes;
