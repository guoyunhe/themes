const { basename } = require('path');

module.exports = {
  apps: [
    {
      name: 'themes.guoyunhe.me',
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
