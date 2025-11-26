# Deployment

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

It is always important to update the repositories before continuing with the server configuration. Run the following command to update the VPS respositories:

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
VITE_API_URL=http://your_ip:3000
VITE_API_KEY=your_api_key
```

The backend .env must look like this:

```bash
DB_HOST=yourhosthere
DB_USER=youruserhere
DB_PASSWORD=yourpasswordhere
DB_NAME=yourdbnamehere
DB_DIALECT=yourdialecthere
DB_PORT=yourdbporthere
DB_SSL=yourslshere
JWT_SECRET=yoursecretword
```

- **Run PM2**

In Order to run the frontend, we have to navigate to the frontend directory, install the dependencies and run the following command:

```bash
pm2 start "npm run dev -- --host 0.0.0.0" --name frontend
```

For the backend, we have to navigate to the backend directory, install the dependencies and run the following command:

```bash
pm2 start "node index.js" --name backend
```

### DataBase

We have hosted our MySQL database on DigitalOcean as well. See the architecture and setup in [diagrams.md](./diagrams.md).