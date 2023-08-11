module.exports = {
  projects: {
    logs: {
      entryPoint: "./logs/api/src/main.ts",
      port: process.env.LOGS_PORT,
    },
    sso: {
      entryPoint: "./single-sign-on/api/src/main.ts",
      port: process.env.SSO_PORT,
    },
  },
};
