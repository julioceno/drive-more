function developmentConfig() {
  return {
    auth: {
      clientId: process.env.CLIENT_ID,
    },
  };
}

export { developmentConfig };
