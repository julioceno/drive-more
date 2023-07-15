function developmentConfig() {
  return {
    authToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiration: Number(process.env.ACCESS_TOKEN_TLL) || 60 * 15,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiration: Number(process.env.REFRESH_TOKEN_TTL) || 60 * 60 * 24,
    },
  };
}

export { developmentConfig };
