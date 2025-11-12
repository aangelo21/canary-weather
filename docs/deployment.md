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

We have cloned the repository inside our DigitalOcean Droplet (VPS). There, we installed PM2 to have both front and backend running at all times. 

![pm2-screenshot](/public/pm2-list.png)

- For the frontend
```bash
pm2 start "npm run dev -- --host 0.0.0.0" --name frontend
```
- For the backend

```bash
pm2 start "node index.js" --name backend
```

### DataBase

We have hosted our MySQL database on DigitalOcean as well. See the architecture and setup in [diagrams.md](./diagrams.md).

## Git

We have used git as the controll version software.