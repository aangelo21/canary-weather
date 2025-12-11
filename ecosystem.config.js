module.exports = {
  apps: [
    {
      name: "canary-backend",
      cwd: "./backend",
      script: "index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_file: "./backend/.env",
      // Logs configuration - stored outside the project directory
      output: "../logs/backend/out.log",
      error: "../logs/backend/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true
    },
    {
      name: "canary-frontend",
      cwd: "./frontend",
      script: "npm run dev -- --host 0.0.0.0",
      env_file: "./frontend/.env",
      instances: 1,
      autorestart: true,
      watch: false,
      // Logs configuration - stored outside the project directory
      output: "../logs/frontend/out.log",
      error: "../logs/frontend/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true
    }
  ]
};

