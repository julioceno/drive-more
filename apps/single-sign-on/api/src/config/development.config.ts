function developmentConfig() {
  return {
    authToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiration: Number(process.env.ACCESS_TOKEN_TTL) || 60,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiration: Number(process.env.REFRESH_TOKEN_TTL) || 60 * 2,
    },
  };
}

export { developmentConfig };
