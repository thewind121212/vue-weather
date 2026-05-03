module.exports = {
  apps: [
    {
      name: "vue-weather",
      script: "server.js",
      interpreter: "bun",
      instances: 1,
      exec_mode: "fork",
      env: {},
      max_restarts: 10,
      restart_delay: 2000,
      kill_timeout: 8000,
      listen_timeout: 8000,
    },
  ],
};
