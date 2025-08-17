# 🔐 How to Update Beta Mode Secret Pin

This guide shows you how to update the beta mode secret pin in both local development and production environments.

## 📍 Local Development (Your Computer)

### Method 1: Update .env File
```bash
cd imaginarychat
nano .env
```

Change the `BETA_SECRET_PIN` value:
```env
BETA_SECRET_PIN=YourNewSecretPin123
```

Then restart your server:
```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
npm run server
```

### Method 2: Direct MongoDB Update (Advanced)
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use imaginarychat

# Update the pin in the database
db.betapins.updateOne(
  { pin: "123456" },  // Old pin
  { $set: { pin: "YourNewPin123" } }  // New pin
)

# Verify the update
db.betapins.find()

# Exit MongoDB
exit
```

## 🚀 Production (VPS) - Method 1: Environment Variable

### Step 1: SSH into your VPS
```bash
ssh root@31.97.59.121
```

### Step 2: Navigate to project directory
```bash
cd /var/www/imaginarychat.com
```

### Step 3: Update .env file
```bash
nano .env
```

Change the pin:
```env
BETA_SECRET_PIN=YourNewProductionPin456
```

### Step 4: Restart the server
```bash
pm2 restart imaginarychat-server
```

### Step 5: Verify the change
```bash
pm2 logs imaginarychat-server
```

## 🚀 Production (VPS) - Method 2: Direct Database Update

### Step 1: SSH into your VPS
```bash
ssh root@31.97.59.121
```

### Step 2: Connect to MongoDB
```bash
mongosh
```

### Step 3: Update the pin in database
```bash
# Switch to your database
use imaginarychat

# Find current pin
db.betapins.find()

# Update to new pin
db.betapins.updateOne(
  { pin: "YourOldPin" },
  { $set: { pin: "YourNewSecurePin789" } }
)

# Verify the update
db.betapins.find()

# Exit
exit
```

### Step 4: Update .env file to match (recommended)
```bash
cd /var/www/imaginarychat.com
nano .env
```

Update the `BETA_SECRET_PIN` to match your database:
```env
BETA_SECRET_PIN=YourNewSecurePin789
```

### Step 5: Restart server
```bash
pm2 restart imaginarychat-server
```

## 🔄 Quick Production Update Script

Create this script on your VPS for easy pin updates:

```bash
# Create update script
cat > /var/www/imaginarychat.com/update-pin.sh << 'EOF'
#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./update-pin.sh <new-pin>"
    exit 1
fi

NEW_PIN="$1"
OLD_PIN=$(grep BETA_SECRET_PIN .env | cut -d '=' -f2)

echo "Updating pin from '$OLD_PIN' to '$NEW_PIN'"

# Update .env file
sed -i "s/BETA_SECRET_PIN=.*/BETA_SECRET_PIN=$NEW_PIN/" .env

# Update MongoDB
mongosh --eval "
use imaginarychat;
db.betapins.updateOne(
  { pin: '$OLD_PIN' },
  { \$set: { pin: '$NEW_PIN' } }
);
db.betapins.find();
"

# Restart server
pm2 restart imaginarychat-server

echo "Pin updated successfully!"
EOF

# Make it executable
chmod +x /var/www/imaginarychat.com/update-pin.sh
```

### Usage:
```bash
cd /var/www/imaginarychat.com
./update-pin.sh "MyNewSecurePin2024"
```

## ✅ Verification Steps

After updating the pin, test it:

1. **Visit your site**: `http://31.97.59.121` (or your domain)
2. **Click**: "🔐 Beta Mode" button
3. **Enter**: Your new pin
4. **Verify**: Should show "Logged in" message

## 🔒 Security Best Practices

1. **Use Strong Pins**: Mix of letters, numbers, and symbols
2. **Regular Updates**: Change pins periodically
3. **Keep .env Secure**: Never commit .env to Git
4. **Monitor Access**: Check PM2 logs for authentication attempts

## 📝 Pin Requirements

- Minimum 6 characters
- Can contain letters, numbers, and symbols
- Case sensitive
- No spaces allowed

Your beta mode pin can be updated anytime using these methods!