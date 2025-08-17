# ImaginaryChat Beta Mode Setup

This guide will help you set up the beta mode feature with MongoDB authentication.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally
- PM2 (for production deployment)

## Local Development Setup

1. **Install Dependencies**
   ```bash
   cd imaginarychat
   npm install
   ```

2. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the `BETA_SECRET_PIN` with your desired pin
   ```bash
   cp .env.example .env
   ```

4. **Start the Backend Server**
   ```bash
   npm run server
   ```

5. **Start the React App** (in a new terminal)
   ```bash
   npm start
   ```

6. **Test the Beta Mode**
   - Open http://localhost:3000
   - Click the "🔐 Beta Mode" button
   - Enter the pin from your `.env` file (default: 123456)

## Production Deployment

### Server Requirements

- Ubuntu/Debian server
- Node.js, MongoDB, Nginx, PM2 installed
- Domain pointing to your server

### Installation Steps

1. **Install Required Software**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Clone Repository**
   ```bash
   sudo mkdir -p /var/www/imaginarychat.com
   sudo chown $USER:$USER /var/www/imaginarychat.com
   cd /var/www/imaginarychat.com
   git clone https://github.com/yourusername/imaginarychat.git .
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

4. **Make Deploy Script Executable**
   ```bash
   chmod +x deploy.sh
   ```

5. **Configure Nginx**
   Create `/etc/nginx/sites-available/imaginarychat.com`:
   ```nginx
   server {
       listen 80;
       server_name imaginarychat.com www.imaginarychat.com;
       root /var/www/imaginarychat.com/build;
       index index.html;

       # Serve React app
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to Node.js server
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/imaginarychat.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Run Initial Deployment**
   ```bash
   ./deploy.sh
   ```

## GitHub Deployment Steps

When you push to GitHub, follow these steps on your server:

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Navigate to project directory**
   ```bash
   cd /var/www/imaginarychat.com
   ```

3. **Run deployment script**
   ```bash
   ./deploy.sh
   ```

The script will:
- Pull latest changes from GitHub
- Install dependencies
- Start MongoDB service
- Build the React app
- Start/restart the Node.js server with PM2
- Reload Nginx

## Environment Variables

### Development (.env)
```
MONGODB_URI=mongodb://localhost:27017/imaginarychat
MONGODB_DB_NAME=imaginarychat
BETA_SECRET_PIN=123456
PORT=5000
NODE_ENV=development
```

### Production (.env)
```
MONGODB_URI=mongodb://localhost:27017/imaginarychat
MONGODB_DB_NAME=imaginarychat
BETA_SECRET_PIN=your_secure_pin_here
PORT=5000
NODE_ENV=production
```

## API Endpoints

- `POST /api/verify-beta-pin` - Verify beta access pin
- `GET /api/health` - Health check endpoint

## Troubleshooting

1. **MongoDB Connection Issues**
   ```bash
   sudo systemctl status mongod
   sudo systemctl start mongod
   ```

2. **PM2 Process Issues**
   ```bash
   pm2 list
   pm2 logs imaginarychat-server
   pm2 restart imaginarychat-server
   ```

3. **Nginx Issues**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   sudo systemctl reload nginx
   ```

4. **Check Server Logs**
   ```bash
   pm2 logs imaginarychat-server