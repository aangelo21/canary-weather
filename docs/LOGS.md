#  Log Rotation and management

This document outlines the procedure for setting up professional logging and log rotation for the Canary Weather application (Frontend and Backend) using PM2.

## Overview

The application uses PM2 for process management. Logs are configured to be stored in a dedicated `logs` directory **outside** the project root (e.g., `../logs`), separated by service (`frontend` and `backend`). Log rotation is handled by the `pm2-logrotate` module to ensure logs are archived daily and do not consume excessive disk space.

## Prerequisites

- **Node.js** and **npm** installed.
- **PM2** installed globally:
  ```bash
  npm install -g pm2
  ```

## Configuration

The PM2 configuration is located in **ecosystem.config.js** in the project root.

### Log Locations

Logs are stored outside the project directory (relative to the ecosystem file):

- **Backend Logs**: `../logs/backend/`
  - `out.log`: Standard output (stdout)
  - `error.log`: Error output (stderr)
- **Frontend Logs**: `../logs/frontend/`
  - `out.log`: Standard output
  - `error.log`: Error output

### Ecosystem File (`ecosystem.config.js`)

The configuration file defines two applications and loads environment variables from their respective `.env` files:
1.  **canary-backend**: Runs the Node.js backend. Loads env vars from `backend/.env`.
2.  **canary-frontend**: Runs the frontend application. Loads env vars from `frontend/.env`.

## Setup Procedure

### 1. Install `pm2-logrotate`

To enable log rotation (saving logs once per day), install the `pm2-logrotate` module:

```bash
pm2 install pm2-logrotate
```

### 2. Configure Log Rotation

Configure the rotation settings to rotate logs daily and keep them for a specific period.

```bash
# Rotate logs every day at midnight (00:00)
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Keep 30 rotated log files
pm2 set pm2-logrotate:retain 30

# Maximum size of log file before rotation (e.g., 10MB) - Optional if using daily rotation
pm2 set pm2-logrotate:max_size 5M

# Compress rotated logs
pm2 set pm2-logrotate:compress true

# Date format in log filenames
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
```
![logrotate config](/docs/public/logs/config-logs.png)

### 3. Build the Frontend

Before starting the application, ensure the frontend is built:

```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Start the Application

Start the application using the ecosystem file:

```bash
pm2 start ecosystem.config.js
```
![pm2 start ecosystem](/docs/public/logs/pm2-start-module.png)

This will start both the backend and frontend processes.

### 5. Save PM2 List

To ensure the application restarts on server reboot:

```bash
pm2 save
pm2 startup
```

(Follow the instructions provided by `pm2 startup` to execute the necessary command).

## Viewing Logs

You can view logs in real-time or check the log files directly.

### Real-time Logs

```bash
# View all logs
pm2 logs

# View specific app logs
pm2 logs canary-backend
pm2 logs canary-frontend
```

### Log Files

Logs are stored in the `logs/` directory:

```bash
ls -l logs/backend
ls -l logs/frontend
```

## Maintenance

- **Flush Logs**: To clear current logs manually:
  ```bash
  pm2 flush
  ```
- **Reload Configuration**: If you change `ecosystem.config.js`:
  ```bash
  pm2 reload ecosystem.config.js
  ```
