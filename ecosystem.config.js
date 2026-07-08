module.exports = {
  apps: [
    {
      name: "fonex-api",
      cwd: "/var/www/fonex/apps/api",
      script: "dist/main.js",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "fonex-web",
      cwd: "/var/www/fonex/apps/web",
      script: "/var/www/fonex/node_modules/next/dist/bin/next",
      args: "start -p 3001",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
