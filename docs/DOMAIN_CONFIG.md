# Domain, DNS & SSL Configuration Guide

This document details the technical process for domain acquisition, DNS record configuration, Nginx reverse proxy setup, and SSL certificate implementation for the **CanaryWeather** project.

---

## Domain Configuration

### Acquisition

The domain **`canaryweather.xyz`** was bough in Vercel for the project.

### DNS Configuration

To link the domain with the server, DNS records must be configured in your domain registrar's control panel.

**Required DNS Configuration Steps:**
1.  Access the **Domain Management** section for `canaryweather.xyz`.
2.  Navigate to **DNS Settings** or **DNS Zone Management**.
3.  Add/Modify the **A Record** to point to the DigitalOcean Droplet:
    *   **Host/Name:** `@` (represents the root domain `canaryweather.xyz`)
    *   **Type:** `A`
    *   **Value/Destination:** `134.209.22.118` (The public IP address of the DigitalOcean Droplet)
    *   **TTL:** Default (usually 1 hour or 3600 seconds)
4.  (Optional) Add a **CNAME Record** for the `www` subdomain:
    *   **Host/Name:** `www`
    *   **Type:** `CNAME`
    *   **Value/Destination:** `canaryweather.xyz`
5.  Ensure **NS Records (Name Servers)** are properly configured to allow DNS management.

> **Note on Propagation:** DNS changes are not instantaneous. They typically take between **5 minutes and 24 hours** to propagate globally.

---

## Application Configuration

Before setting up the web server, the application code needs to be configured to accept requests from the domain.

### Frontend (Vite)

The Vite configuration in `frontend/vite.config.js` includes settings for production deployment:

```javascript
server: {
    allowedHosts: ['canaryweather.xyz'],
    hmr: {
        host: 'canaryweather.xyz',
        clientPort: 443,
    },
    proxy: {
        '/api': {
            target: 'http://localhost:85',
            changeOrigin: true,
            secure: false,
        },
        '/uploads': {
            target: 'http://localhost:85',
            changeOrigin: true,
            secure: false,
        },
        '/admin': {
            target: 'http://localhost:85',
            changeOrigin: true,
            secure: false,
        },
    }
}
```

### Backend (CORS)

The backend CORS configuration in `backend/index.js` must allow requests from the production domain. The allowed origins are defined as:

```javascript
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://134.209.22.118:5173",
  "https://canaryweather.xyz",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);
```

This configuration allows:
- Local development (`localhost:5173`)
- Direct IP access during deployment
- Production domain with HTTPS (`canaryweather.xyz`)

---

## Nginx Web Server Setup

### Infrastructure Context

The application is deployed on a **DigitalOcean Droplet** (IP: `134.209.22.118`) running **Ubuntu Linux**. **Nginx** is used as the web server and reverse proxy to serve the application and handle domain requests.

### Installation

**Nginx** is a high-performance web server that also acts as a reverse proxy, load balancer, and HTTP cache.

**Installation Commands:**
```bash
sudo apt update
sudo apt install nginx -y
```

**Start and enable Nginx:**
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Reverse Proxy Implementation

### Concept

A **Reverse Proxy** sits in front of web servers and forwards client requests to those servers. In this architecture, Nginx accepts traffic on port 80 (HTTP) and 443 (HTTPS) and forwards it to:
- **Frontend**: Vite development server on port 5173
- **Backend**: Express server on port 85

**Benefits:**
*   **User Experience:** Users access the application via standard domain (`canaryweather.xyz`) without port numbers
*   **Security:** Hides internal network topology and port configuration
*   **SSL Termination:** Nginx handles HTTPS encryption/decryption
*   **Load Balancing:** Can distribute traffic across multiple backend instances
*   **Static File Serving:** Efficiently serves static assets

### Nginx Configuration

Create the configuration file at `/etc/nginx/sites-available/canaryweather.xyz`:

```nginx
server {
    listen 80;
    server_name canaryweather.xyz www.canaryweather.xyz;

    # Frontend (Vite)
    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support for Vite HMR
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin Dashboard
    location /admin {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files (profile pictures, POI images)
    location /uploads {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # API Documentation
    location /api-docs {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Activating the Configuration:**

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/canaryweather.xyz /etc/nginx/sites-enabled/

# Remove default site to avoid conflicts
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Configuration Directives Explained

The Nginx configuration file `/etc/nginx/sites-available/canaryweather.xyz` uses the following directives:

*   `server { ... }`: Defines a server block handling HTTP traffic (port 80) for `canaryweather.xyz` and `www.canaryweather.xyz`
*   `listen 80;`: Binds Nginx to port 80 for incoming HTTP requests
*   `server_name canaryweather.xyz www.canaryweather.xyz;`: Specifies which domains this server block handles
*   `location / { ... }`: Routes root traffic to the Vite frontend server (port 5173)
    - Includes WebSocket headers (`Upgrade`, `Connection`) for Hot Module Replacement (HMR)
*   `location /api { ... }`: Routes API requests to the Express backend (port 85)
*   `location /admin { ... }`: Routes admin dashboard requests to the backend
*   `location /uploads { ... }`: Routes uploaded file requests (profile pictures, POI images) to the backend
*   `location /api-docs { ... }`: Routes Swagger API documentation to the backend
*   `proxy_pass`: Forwards requests to the specified internal server
*   `proxy_set_header`: Passes client information (Host, IP, protocol) to backend servers for proper logging and security

---

## Conflict Resolution: Apache vs. Nginx

### Problem Identification

During Nginx setup, you may encounter a port conflict if **Port 80 is already in use** by another web server like Apache.

**Diagnosis:**
```bash
# Check what's using port 80
sudo lsof -i :80
```

### Resolution

If Apache (or another service) is using port 80, you must stop and disable it:

**Commands:**
```bash
# Stop Apache service
sudo systemctl stop apache2

# Disable Apache from starting on boot
sudo systemctl disable apache2

# Verify port 80 is free
sudo lsof -i :80

# Start Nginx
sudo systemctl start nginx

# Verify Nginx is running
sudo systemctl status nginx
```

**Note:** If you need both Apache and Nginx, configure Apache to use a different port (e.g., 8080) and adjust your proxy configuration accordingly.

---

## SSL/TLS Security (HTTPS)

To ensure secure communication, SSL certificates should be installed using **Let's Encrypt**.

### Tools

*   **Let's Encrypt:** A free, automated Certificate Authority (CA) providing X.509 certificates for TLS encryption
*   **Certbot:** Open-source tool for automatically obtaining and installing Let's Encrypt certificates

### Installation and Configuration

**Install Certbot:**

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

**Obtain and install SSL certificates:**

```bash
sudo certbot --nginx -d canaryweather.xyz -d www.canaryweather.xyz
```

**What Certbot does automatically:**
1.  **Domain Validation:** Verifies you control `canaryweather.xyz`
2.  **Certificate Issuance:** Obtains a signed certificate from Let's Encrypt
3.  **Nginx Configuration:** Modifies Nginx config to use HTTPS
4.  **HTTP to HTTPS Redirect:** Automatically redirects all HTTP traffic to HTTPS
5.  **Auto-renewal Setup:** Configures automatic certificate renewal

**Updated Nginx Configuration (after Certbot):**

Certbot will automatically modify `/etc/nginx/sites-available/canaryweather.xyz` to include:

```nginx
server {
    listen 443 ssl http2;
    server_name canaryweather.xyz www.canaryweather.xyz;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/canaryweather.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/canaryweather.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend (Vite)
    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin Dashboard
    location /admin {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files
    location /uploads {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # API Documentation
    location /api-docs {
        proxy_pass http://127.0.0.1:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name canaryweather.xyz www.canaryweather.xyz;
    
    return 301 https://$server_name$request_uri;
}
```

### Certificate Management

*   **Location:** Certificates are stored in `/etc/letsencrypt/live/canaryweather.xyz/`
*   **Expiration:** Let's Encrypt certificates are valid for 90 days
*   **Auto-renewal:** Certbot creates a systemd timer that automatically renews certificates before expiration

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

**Check renewal timer status:**
```bash
sudo systemctl status certbot.timer
```

**Manual renewal (if needed):**
```bash
sudo certbot renew
```

---

## Process Management with PM2

After configuring Nginx and SSL, the application services must be running on the server. **PM2** is used to manage the Node.js processes.

### Starting the Application

**Backend:**
```bash
cd ~/canary_weather/backend
pm2 start index.js --name canaryweather-backend
```

**Frontend:**
```bash
cd ~/canary_weather/frontend
pm2 start "npm run dev -- --host 0.0.0.0" --name canaryweather-frontend
```

### PM2 Management Commands

```bash
# List all running processes
pm2 list

# View logs
pm2 logs canaryweather-backend
pm2 logs canaryweather-frontend

# Restart services
pm2 restart canaryweather-backend
pm2 restart canaryweather-frontend

# Stop services
pm2 stop canaryweather-backend
pm2 stop canaryweather-frontend

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

For more details on PM2 configuration and deployment, see [docs/DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Final Verification

After completing all configurations, verify everything is working correctly:

**Test Nginx configuration:**
```bash
sudo nginx -t
```

**Reload Nginx:**
```bash
sudo systemctl reload nginx
```

**Check Nginx status:**
```bash
sudo systemctl status nginx
```

**Verify SSL certificate:**
```bash
sudo certbot certificates
```

**Test application access:**
- HTTP (should redirect to HTTPS): `http://canaryweather.xyz`
- HTTPS: `https://canaryweather.xyz`
- API Documentation: `https://canaryweather.xyz/api-docs`
- Admin Panel: `https://canaryweather.xyz/admin`

**Check PM2 processes:**
```bash
pm2 list
pm2 logs
```

The application is now accessible securely via **`https://canaryweather.xyz`**.

---

## Troubleshooting

### Common Issues

**1. 502 Bad Gateway Error**
- Backend service not running: `pm2 list` and restart if needed
- Wrong port in Nginx config: verify proxy_pass ports match your services

**2. SSL Certificate Errors**
- Certificates expired: `sudo certbot renew`
- Wrong certificate path: check `/etc/letsencrypt/live/canaryweather.xyz/`

**3. CORS Errors**
- Verify `ALLOWED_ORIGINS` in backend includes your domain
- Check `allowedHosts` in frontend Vite config

**4. WebSocket Connection Failed**
- Ensure Nginx has `proxy_http_version 1.1` and Upgrade headers
- Check firewall allows HTTPS (port 443)

**5. Static Files Not Loading**
- Verify `/uploads` location in Nginx config
- Check file permissions in `backend/uploads/` directory

### Useful Debugging Commands

```bash
# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :85
sudo lsof -i :5173

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Test SSL configuration
openssl s_client -connect canaryweather.xyz:443

# Check DNS resolution
nslookup canaryweather.xyz
dig canaryweather.xyz
```

---

## Security Recommendations

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

2. **Keep System Updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Enable Fail2Ban:**
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   ```

4. **Regular Certificate Monitoring:**
   - Monitor Certbot renewal logs
   - Test renewal process monthly

5. **Secure Environment Variables:**
   - Never commit `.env` files to version control
   - Use strong JWT and session secrets
   - Rotate secrets periodically

For more security best practices, see [docs/SECURITY.md](../SECURITY.md).