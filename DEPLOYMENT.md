# Deployment Guide

This document outlines the steps required to deploy the backend of the **proyecto Final ELIO** project to a production environment.

---

## Prerequisites

Before deployment, ensure the following:
1. **Server Requirements**:
   - **Node.js** (v16 or higher)
   - **NPM** or **Yarn**
   - **Database Engine** (e.g., MySQL, PostgreSQL, MongoDB)
   - **Environment**: Linux-based systems (e.g., Ubuntu, CentOS) recommended

2. **Domain and Hosting**:
   - A domain name (if applicable).
   - Access to a hosting provider or cloud service (e.g., AWS, DigitalOcean, Heroku).

3. **Environment Variables**:
   - Production environment variables should be prepared in a `.env` file.

---

## Deployment Steps

### 1. Set Up the Production Environment

1. **Clone the Repository**:
   SSH is recommended for secure access:
   ```bash
   git clone git@github.com:your-username/proyectoFinal.git
   cd proyectoFinal
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with production configurations:
   ```env
   PORT=80
   DB_HOST=production_db_host
   DB_USER=production_user
   DB_PASSWORD=secure_password
   DB_NAME=production_database
   JWT_SECRET=production_secret
   ```

4. **Build the Application** (if required):
   If your backend requires transpiling (e.g., TypeScript):
   ```bash
   npm run build
   ```

---

### 2. Configure the Database

1. **Set Up the Database**:
   - Create the production database.
   - Run migration scripts to set up the schema:
     ```bash
     npm run migrate
     ```

2. **Seed the Database** (optional):
   - Populate the database with initial data:
     ```bash
     npm run seed
     ```

---

### 3. Start the Application

1. **Run the Server**:
   For a simple setup:
   ```bash
   npm start
   ```

2. **Use a Process Manager**:
   - Use **PM2** or a similar tool to manage the application process:
     ```bash
     npm install -g pm2
     pm2 start server.js --name "proyectoFinal"
     pm2 save
     pm2 startup
     ```

3. **Check Logs**:
   Ensure the application is running correctly:
   ```bash
   pm2 logs
   ```

---

### 4. Configure Reverse Proxy (Optional)

Set up a reverse proxy using **NGINX** for better performance and security.

1. **Install NGINX**:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure NGINX**:
   Example configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Restart NGINX**:
   ```bash
   sudo systemctl restart nginx
   ```

---

### 5. Set Up SSL (Optional but Recommended)

Use **Let's Encrypt** for free SSL certificates:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### 6. Monitor and Maintain

1. **Monitor Uptime**:
   Use tools like UptimeRobot to monitor server health.

2. **Update Dependencies**:
   Regularly update project dependencies for security and performance:
   ```bash
   npm update
   ```

3. **Backups**:
   Schedule regular backups of the database and `.env` files for disaster recovery.

---

## Troubleshooting

### Application Fails to Start
- Check environment variables in `.env`.
- Review application logs (`pm2 logs` or `npm start` output).

### Database Connection Issues
- Verify database credentials and ensure the database service is running.

---

Congratulations! Your backend is now deployed to production.