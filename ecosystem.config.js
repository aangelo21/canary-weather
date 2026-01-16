module.exports = {
    apps: [
        {
            name: 'canary-backend',
            cwd: './backend',
            script: 'index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 85,
            },
            env_file: './backend/.env',
            // Logs configuration - stored outside the project directory
            output: '../logs/backend/out.log',
            error: '../logs/backend/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            merge_logs: true,
        },
        {
            name: 'canary-frontend',
            cwd: './frontend',
            script: 'serve',
            env: {
                PM2_SERVE_PATH: './dist',
                PM2_SERVE_PORT: 5173,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html',
            },
            env_file: './frontend/.env',
            instances: 1,
            autorestart: true,
            watch: false,
            ignore_watch: ['node_modules'],
            // Logs configuration - stored outside the project directory
            output: '../logs/frontend/out.log',
            error: '../logs/frontend/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            merge_logs: true,
        },
    ],
};
