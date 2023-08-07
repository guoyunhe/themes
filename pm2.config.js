module.exports = {
  apps: [
    {
      name: 'linuxporn',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      env: {
        ENV_PATH: `${__dirname}/.env`,
      },
    },
  ],
};
