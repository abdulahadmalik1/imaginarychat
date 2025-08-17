#!/bin/bash

# Set error handling
set -e

echo "Starting deployment..."

# Navigate to project directory
cd /var/www/imaginarychat.com

# Pull latest changes
echo "Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci

# Check if .env exists, if not create from template
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update .env file with your production values!"
fi

# Start/restart MongoDB service
echo "Ensuring MongoDB is running..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Build the React app
echo "Building React application..."
npm run build

# Start/restart the Node.js server
echo "Starting Node.js server..."
pm2 stop imaginarychat-server || true
pm2 start server/server.js --name imaginarychat-server

# Reload nginx
echo "Reloading nginx..."
sudo systemctl reload nginx

echo "Deployment complete!"
echo "React app built and served by nginx"
echo "Node.js API server running on PM2"
echo "MongoDB service is active"
