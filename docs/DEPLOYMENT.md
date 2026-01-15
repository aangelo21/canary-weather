# CanaryWeather Deployment Guide

## DigitalOcean

DigitalOcean is a cloud infrastructure provider that offers simple and scalable cloud computing solutions. Founded in 2011, it specializes in providing developer-friendly tools and services, including virtual servers, managed databases, storage, and networking. DigitalOcean is known for its user-friendly interface, competitive pricing, and focus on simplicity compared to larger cloud providers like AWS or Azure.

Key features of DigitalOcean include:
- Easy-to-use control panel and API
- Global data centers
- Competitive pricing with transparent costs
- Strong community and documentation
- Support for popular technologies and frameworks

### Droplet/PM2

- **Update repositories**

It is always important to update the repositories before continuing with the server configuration. Run the following command to update the VPS repositories:

```bash 
apt update && apt upgrade -y 
``` 

- **Install Git**

Run the following command to install Git:

```bash
apt install git -y
```

- **Clone the repository**

```bash
git clone https://github.com/aangelo21/canary_weather
```

- **Install Node.js & npm**

In order to install the latest LTS version of Node.js and npm, we have to first install nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Restart the shell to apply the changes using:

```bash
\. "$HOME/.nvm/nvm.sh"
```

Then, install Node.js and npm using nvm:

```bash
nvm install 24
```

To verify the installation of both Node.js and npm run:

```bash
node -v
npm -v
```

You should see something like this after you complete the last step

![node-version](/docs/public/deployment/node-version.png)

- **Install PM2**

Since PM2 is a npm package, run the following command to install PM2:

```bash
npm install pm2 -g -y
```

- **Create .env**

The frontend .env must look like this:

```bash
VITE_API_BASE=/api
VITE_OPENWEATHER_API_KEY=your_api_key
```

The backend .env must look like this:

```bash
DB_HOST=yourhosthere
DB_USER=youruserhere
DB_PASSWORD=yourpasswordhere
DB_NAME=yourdbnamehere
DB_DIALECT=yourdialecthere
DB_PORT=yourdbporthere
DB_SSL=yoursslhere
JWT_SECRET=yoursecretword
```

- **Run PM2**

The project uses an `ecosystem.config.js` file to manage both frontend and backend processes with PM2. This configuration includes:
- Proper log management
- Environment variables from .env files
- Frontend serving of built static files
- Backend Node.js server

To start both applications:

```bash
pm2 start ecosystem.config.js
```

This will start:
- `canary-backend`: Backend API on port 85
- `canary-frontend`: Frontend serving static files from dist/ on port 5173

**Note:** Before running PM2, make sure to build the frontend:

```bash
cd frontend
npm run build
cd ..
```

### Database

We have hosted our MySQL database on DigitalOcean as well. See the architecture and setup in [DIAGRAMS.md](./DIAGRAMS.md).

## Sprint Deployments

### Github

- Push the changes to the develop branch in github
- Create a pull request to main and wait for approval
- Once approved, create a release with the name tag corresponding to the version of the deployment

### PM2 & droplet

- Run ``git pull origin main`` to ensure the latest changes are downloaded
- Install the dependencies with ``npm i`` (in both /frontend and /backend directories)
- Restart the pm2 services ``pm2 restart all`` (inside the project root folder, since ecosystem.config.js handles the pm2 restart the intended way)