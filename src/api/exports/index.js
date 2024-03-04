const ExportHandler = require('./handler');
const routes = require('./routes');

const registerExport = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { exportService, playlistsService, validator }) => {
    const exportHandler = new ExportHandler(exportService, playlistsService, validator);
    server.route(routes(exportHandler));
  },
};

module.exports = registerExport;
