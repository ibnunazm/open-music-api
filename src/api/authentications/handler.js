class AuthHandler {
  constructor(authService, userService, tokenManager, validator) {
    this._authService = authService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler(req, h) {
    await this._validator.validatePayloadAuthentications(req.payload);
    const { username, password } = req.payload;
    const id = await this._userService.verifyUserCredential(username, password);

    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });
    await this._authService.addRefreshToken(refreshToken);

    const response = h.response({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthHandler(req) {
    await this._validator.validateRefreshToken(req.payload);
    const { refreshToken } = req.payload;

    await this._authService.verifyRefreshToken(refreshToken);
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: "success",
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthHandler(req) {
    await this._validator.validateRefreshToken(req.payload);
    const { refreshToken } = req.payload;

    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);

    return {
      status: "success",
      message: "Refresh token berhasil dihapus",
    };
  }
}

module.exports = AuthHandler;
