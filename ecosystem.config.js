module.exports = {
  apps: [
    {
      name: 'girenad',
      script: 'npm',
      args: 'run start:safe',
      cwd: '.',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
