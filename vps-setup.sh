#!/bin/bash

# VPS Setup Script for ImaginaryChat Beta Mode
# Run this script on your VPS after SSH'ing in

set -e

echo "🚀 Starting ImaginaryChat VPS Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root"
    exit 1
fi

print_status "Updating system packages..."
apt update && apt upgrade -y

print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

print_status "Verifying Node.js installation..."
node --version
npm --version

print_status "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

print_status "Starting and enabling MongoDB..."
systemctl start mongod
systemctl enable mongod
systemctl status mongod --no-pager

print_status "Installing PM2 for process management..."
npm install -g pm2

print_status "Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

print_status "Setting up project directory..."
mkdir -p /var/www/imaginarychat.com
cd /var/www/imaginarychat.com

print_status "Cloning repository..."
if [ -d ".git" ]; then
    print_warning "Repository already exists, pulling latest changes..."
    git pull origin main
else
    git clone https://github.com/abdulahadmalik1/imaginarychat.git .
fi

print_status "Installing dependencies..."
npm ci

print_status "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Please edit .env file with your production values:"
    print_warning "nano .env"
    print_warning "Update BETA_SECRET_PIN with your secure pin!"
else
    print_warning ".env file already exists"
fi

print_status "Building React application..."
npm run build

print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/imaginarychat.com << 'EOF'
server {
    listen 80;
    server_name imaginarychat.com www.imaginarychat.com _;
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/imaginarychat.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

print_status "Testing Nginx configuration..."
nginx -t

print_status "Reloading Nginx..."
systemctl reload nginx

print_status "Starting Node.js server with PM2..."
pm2 stop imaginarychat-server 2>/dev/null || true
pm2 start server/server.js --name imaginarychat-server
pm2 save
pm2 startup

print_status "Setting up firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

print_status "Deployment completed successfully! 🎉"
echo ""
print_status "Next steps:"
echo "1. Edit your .env file: nano /var/www/imaginarychat.com/.env"
echo "2. Update BETA_SECRET_PIN with your secure pin"
echo "3. Restart the server: pm2 restart imaginarychat-server"
echo "4. Check status: pm2 status"
echo "5. View logs: pm2 logs imaginarychat-server"
echo ""
print_status "Your site should be accessible at: http://$(curl -s ifconfig.me)"
echo ""
print_status "To update in the future, run: /var/www/imaginarychat.com/deploy.sh"