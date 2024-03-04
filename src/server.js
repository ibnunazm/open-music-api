const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const dotenv = require('dotenv');
const Inert = require('@hapi/inert');
const path = require('path');
const SongsService = require('./services/SongsService');
const AlbumsService = require('./services/AlbumsService');
const AuthService = require('./services/authService');
const UsersService = require('./services/usersService');
const CollaborationsService = require('./services/collaborationsService');
const PlaylistService = require('./services/playlistsService');
const ActivitiesService = require('./services/activitiesService');
const LikesAlbumService = require('./services/likesAlbumService.js');
const CacheService = require('./services/redis/CacheService.js');
const StorageService = require('./services/storage/StorageService.js');
const ClientError = require('./exceptions/ClientError');
const registerSong = require('./api/songs');
const registerAlbum = require('./api/albums');
const registerUser = require('./api/users');
const registerAuth = require('./api/authentications');
const registerPlaylist = require('./api/playlists');
const registerCollab = require('./api/collaborations');
const registerActivities = require('./api/activities');
const registerUpload = require('./api/uploads');
const registerLikes = require('./api/likesAlbum');
const songValidation = require('./validator/songs');
const albumValidation = require('./validator/albums');
const userValidation = require('./validator/users');
const authValidation = require('./validator/authentications');
const playlistValidation = require('./validator/playlists');
const collaborationValidation = require('./validator/collaborations');
const uploadValidation = require('./validator/uploads');
const tokenManager = require('./tokenize/TokenManager');

//Export
const ProducerService = require('./services/rabbitmq/ProducerService.js');
const registerExport = require('./api/exports');
const exportValidation = require('./validator/exports');

dotenv.config();

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumsService();
  const authService = new AuthService();
  const usersService = new UsersService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistService(collaborationsService);
  const activitiesService = new ActivitiesService();
  const cacheService = new CacheService();
  const likesAlbumService = new LikesAlbumService(cacheService);

  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: registerSong,
      options: {
        service: songsService,
        validator: songValidation,
      },
    },
    {
      plugin: registerAlbum,
      options: {
        service: albumService,
        validator: albumValidation,
      },
    },
    {
      plugin: registerUser,
      options: {
        usersService: usersService,
        validator: userValidation,
      },
    },
    {
      plugin: registerAuth,
      options: {
        authService: authService,
        userService: usersService,
        tokenManager: tokenManager,
        validator: authValidation,
      },
    },
    {
      plugin: registerPlaylist,
      options: {
        playlistsService: playlistsService,
        songsService: songsService,
        activitiesService: activitiesService,
        validator: playlistValidation,
      },
    },
    {
      plugin: registerCollab,
      options: {
        playlistsService: playlistsService,
        collaborationsService: collaborationsService,
        validator: collaborationValidation,
      },
    },
    {
      plugin: registerActivities,
      options: {
        activitiesService: activitiesService,
        playlistsService: playlistsService,
      },
    },
    {
      plugin: registerExport,
      options: {
        exportService: ProducerService,
        playlistsService: playlistsService,
        validator: exportValidation,
      },
    },
    {
      plugin: registerUpload,
      options: {
        storageService: storageService,
        albumsService: albumService,
        validator: uploadValidation,
      },
    },
    {
      plugin: registerLikes,
      options: {
        LikesAlbumService: likesAlbumService,
        AlbumsService: albumService,
      },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
