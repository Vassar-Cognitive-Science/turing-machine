module.exports = {
  apps: [{
    name: 'turing-machine',
    script: './src/server/index.js',
    instances: 1,
    exec_mode: 'cluster',
    
    // Environment configuration
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    },
    
    // Process management
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Logging
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    merge_logs: true,
    log_type: 'json',
    
    // Advanced options
    kill_timeout: 5000,
    listen_timeout: 8000,
    shutdown_with_message: true,
    
    // Auto restart conditions
    ignore_watch: [
      'node_modules',
      'logs',
      'public/static'
    ],
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};