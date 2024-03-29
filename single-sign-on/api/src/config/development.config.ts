function developmentConfig() {
  return {
    authToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiration: Number(process.env.ACCESS_TOKEN_TTL) || 60 * 15,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiration: Number(process.env.REFRESH_TOKEN_TTL) || 60 * 60 * 24,
    },
    clientsIds: {
      authClientId: process.env.SSO_CLIENT_ID,
      logsClientId: process.env.LOGS_CLIENT_ID,
      schedulingClientId: process.env.MANAGEMENT_CLIENT_ID,
    },
  };
}

export { developmentConfig };
