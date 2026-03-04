# CanaryWeather Deployment Guide

## Architecture Overview

CanaryWeather is deployed entirely on Render:
- **Frontend**: Render Static Site (React + Vite)
- **Backend**: Render Web Service (Node.js + Express API)
- **Database**: Render PostgreSQL

---

## Frontend (Render Static Site)

### Setup

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Set environment variables in Render dashboard:
   ```
   VITE_API_BASE=https://your-backend.onrender.com/api
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

5. Add a rewrite rule for SPA routing:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: Rewrite

6. Deploy — Render will automatically build and deploy on every push to `main`

---

## Backend (Render Web Service)

### Setup

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment**: Node

4. Set environment variables in Render dashboard:
   ```
   DB_HOST=your_render_db_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db_name
   DB_PORT=5432
   DB_DIALECT=postgres
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend.onrender.com
   BACKEND_URL=https://your-backend.onrender.com
   NODE_ENV=production
   RESEND_API_KEY=your_resend_api_key
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   VAPID_SUBJECT=your_subject
   GITHUB_MODELS_API_KEY=your_api_key
   ```

5. Render will auto-deploy on pushes to `main` and assigns a `PORT` env var automatically

### Health Check

Verify the backend is running: `GET https://your-backend.onrender.com/api/health`

---

## Database (Render PostgreSQL)

1. Create a new **PostgreSQL** database on Render
2. Note the connection credentials (host, user, password, database name, port)
3. The internal connection string is available in the Render dashboard
4. Run migrations:
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```

---

## Sprint Deployments

### GitHub Workflow

1. Push changes to the `develop` branch
2. Create a pull request to `main` and wait for approval
3. Once merged, Render auto-deploys frontend and backend from `main`
4. Create a release tag for the version

---

## Local Development

### Backend
```bash
cd backend
cp .env.example .env  # Edit with your local values
npm install
npm start
```

### Frontend
```bash
cd frontend
cp .env.example .env  # Edit with your local values
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `http://localhost:10000` by default.
