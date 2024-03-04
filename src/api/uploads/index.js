const UploadHandler = require('./handler');
const routes = require('./routes');

const registerUpload = {
  name: 'upload',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, validator }) => {
    const uploadHandler = new UploadHandler(storageService, albumsService, validator);
    server.route(routes(uploadHandler));
  },
};

module.exports = registerUpload;
