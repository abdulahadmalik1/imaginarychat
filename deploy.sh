#!/bin/bash
cd /var/www/imaginarychat.com
git pull origin main
npm ci
npm run build
systemctl reload nginx
echo "Deployment complete!"
