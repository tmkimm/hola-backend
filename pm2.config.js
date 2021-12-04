module.exports = {
  apps: [
    {
      name: 'hola-backend',
      script: './build/app.js',
      instances: 1,
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 50000,
    },
  ],
};
