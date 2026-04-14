# SafeStop -- Deployment Guide

How to deploy SafeStop to every platform: Web, iOS, Android, and backend.

---

## Table of Contents

1. [Web (Vercel)](#1-web-vercel)
2. [iOS (Expo EAS Build)](#2-ios-expo-eas-build)
3. [Android (Expo EAS Build)](#3-android-expo-eas-build)
4. [DigitalOcean Backend](#4-digitalocean-backend)
5. [Environment Variables](#5-environment-variables)
6. [Post-Deployment Checklist](#6-post-deployment-checklist)

---

## 1. Web (Vercel)

The web portal and PWA are deployed to Vercel. This is already configured and deployed.

### Initial Setup (Already Done)

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
cd apps/web
vercel link

# Deploy to production
vercel --prod
```

### Automatic Deployments

Vercel auto-deploys on every push to the `main` branch:

- **Production**: Push to `main` deploys to production URL.
- **Preview**: Every PR gets a unique preview URL.

### Configuration

The `vercel.json` at the project root handles routing:

```json
{
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

### Custom Domain

1. Go to Vercel Dashboard > Project Settings > Domains.
2. Add your domain (e.g., `app.safestop.com`).
3. Update DNS records as instructed by Vercel.
4. SSL is provisioned automatically.

### PWA Configuration

The Next.js app includes a service worker for offline capability:

1. Service worker registered in `_app.tsx` or layout.
2. Web app manifest at `/public/manifest.json`.
3. Icons at `/public/icons/` in required sizes (192x192, 512x512).
4. Users can "Add to Home Screen" on mobile browsers.

### Expo Web Export (Alternative)

The mobile app can also be exported as a static web app:

```bash
cd apps/mobile
npx expo export --platform web
npx serve dist
```

This is useful for demos but is not the primary web deployment method.

---

## 2. iOS (Expo EAS Build)

### Prerequisites

- **Apple Developer Account**: $99/year at [developer.apple.com](https://developer.apple.com).
- **EAS CLI**: Installed globally.
- **Expo account**: Free at [expo.dev](https://expo.dev).

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Step 2: Configure eas.json

Create `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### Step 3: Configure app.json for iOS

Ensure `apps/mobile/app.json` includes:

```json
{
  "expo": {
    "name": "SafeStop",
    "slug": "safestop",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.safestop.app",
      "buildNumber": "1",
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "SafeStop needs camera access to take confirmation photos of your backseat.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "SafeStop needs location access to detect when your vehicle stops so it can prompt you to confirm your child is safe.",
        "NSLocationWhenInUseUsageDescription": "SafeStop needs location access to detect vehicle stops.",
        "NSPhotoLibraryUsageDescription": "SafeStop needs photo library access to save confirmation photos."
      }
    }
  }
}
```

### Step 4: Build for iOS Simulator (Testing)

```bash
cd apps/mobile
eas build --platform ios --profile development
```

This creates a `.app` file you can install on the iOS Simulator.

### Step 5: Build for Physical Device (TestFlight)

```bash
cd apps/mobile
eas build --platform ios --profile preview
```

This creates an `.ipa` file. Install via TestFlight for internal testing.

### Step 6: Build for App Store Release

```bash
cd apps/mobile
eas build --platform ios --profile production
```

### Step 7: Submit to App Store

```bash
eas submit --platform ios
```

Or manually upload via Transporter app.

### App Store Review Checklist

- [ ] Privacy policy URL configured in App Store Connect
- [ ] Screenshots for iPhone 6.7" and 6.1" displays
- [ ] App description emphasizing child safety (reviewers may flag health/safety apps)
- [ ] Background location usage explanation (Apple requires detailed justification)
- [ ] Camera permission usage explanation
- [ ] Notification permission usage explanation
- [ ] Demo account credentials for reviewers (use the demo data seed)
- [ ] Age rating: 4+ (no objectionable content)
- [ ] Category: Lifestyle or Health & Fitness

### Background Location Approval

Apple requires extra justification for "Always" location access. Include this in the review notes:

> "SafeStop requires background location access to detect when a vehicle stops during an active child safety session. This is essential for the core safety feature: prompting the driver to confirm their child has been removed from the vehicle. Location data is only collected during active sessions and is never sold or shared with third parties."

---

## 3. Android (Expo EAS Build)

### Prerequisites

- **Google Play Developer Account**: $25 one-time fee at [play.google.com/console](https://play.google.com/console).
- **EAS CLI**: Already installed from iOS setup.

### Step 1: Configure app.json for Android

Ensure `apps/mobile/app.json` includes:

```json
{
  "expo": {
    "android": {
      "package": "com.safestop.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    }
  }
}
```

### Step 2: Build APK (Testing)

For direct installation on Android devices:

```bash
cd apps/mobile
eas build --platform android --profile preview
```

This creates an `.apk` file you can sideload.

### Step 3: Build AAB (Play Store)

Google Play requires Android App Bundle format:

```bash
cd apps/mobile
eas build --platform android --profile production
```

This creates an `.aab` file.

### Step 4: Configure eas.json for Android Submit

Add to the `submit` section of `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 5: Create Google Service Account

1. Go to Google Play Console > Setup > API access.
2. Create a new service account in Google Cloud Console.
3. Grant "Service Account User" role.
4. Download the JSON key file.
5. In Play Console, grant the service account "Release manager" permission.
6. Save the key as `google-service-account-key.json` in `apps/mobile/` (add to `.gitignore`).

### Step 6: Submit to Google Play

```bash
eas submit --platform android
```

### Google Play Store Listing

- [ ] Short description (80 chars): "Prevent children from being left in vehicles. Photo-verified safety."
- [ ] Full description (4000 chars): Detailed feature list
- [ ] Screenshots: Phone (min 2), Tablet (optional)
- [ ] Feature graphic: 1024x500 PNG
- [ ] Privacy policy URL
- [ ] Content rating questionnaire completed
- [ ] Target audience: Parents, caregivers
- [ ] Category: Parenting
- [ ] Pricing: Free (with in-app purchases)

### Google Play Background Location

Google requires a video demonstrating why background location is needed. Record a 30-60 second video showing:

1. Starting a session with a child.
2. The app detecting a vehicle stop in the background.
3. The confirmation prompt appearing.

Upload this video in the Play Console under "App content" > "Sensitive permissions".

---

## 4. DigitalOcean Backend

### Step 1: Create Droplet

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com).
2. Create Droplet:
   - **Image**: Ubuntu 24.04 LTS
   - **Plan**: Basic $6/month (1 vCPU, 1 GB RAM, 25 GB SSD)
   - **Region**: Choose nearest to your users (e.g., NYC1)
   - **Authentication**: SSH key (recommended) or password
3. Note the droplet IP address.

### Step 2: Initial Server Setup

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser safestop
usermod -aG sudo safestop

# Set up firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable

# Switch to new user
su - safestop
```

### Step 3: Install Node.js

```bash
# Install Node.js 22 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # v22.x.x
npm --version   # 10.x.x
```

### Step 4: Install PostgreSQL

```bash
# Install PostgreSQL 16
sudo apt install -y postgresql postgresql-contrib

# Start and enable
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'SQL'
CREATE USER safestop WITH PASSWORD 'your-secure-password-here';
CREATE DATABASE safestop_db OWNER safestop;
GRANT ALL PRIVILEGES ON DATABASE safestop_db TO safestop;
SQL

# Test connection
psql -U safestop -d safestop_db -h localhost
```

### Step 5: Clone and Deploy Next.js Backend

```bash
# Clone repository
cd /home/safestop
git clone https://github.com/your-org/safestop.git
cd safestop/apps/web

# Install dependencies
npm install

# Create environment file
cat > .env << 'ENV'
DATABASE_URL=postgresql://safestop:your-secure-password-here@localhost:5432/safestop_db
BETTER_AUTH_SECRET=generate-a-random-64-char-string
BETTER_AUTH_URL=https://api.safestop.com
EXPO_PUSH_TOKEN=your-expo-push-access-token
NODE_ENV=production
ENV

# Run database migrations
npx drizzle-kit push

# Build
npm run build

# Test
npm start
```

### Step 6: Set Up PM2 Process Manager

```bash
# Install PM2
sudo npm install -g pm2

# Start the app
cd /home/safestop/safestop/apps/web
pm2 start npm --name "safestop-api" -- start

# Save PM2 config
pm2 save

# Set up startup script (runs on reboot)
pm2 startup
# Follow the output instructions
```

### Step 7: Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo tee /etc/nginx/sites-available/safestop << 'NGINX'
server {
    listen 80;
    server_name api.safestop.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # SSE support
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }

    # Photo uploads (increase max body size)
    client_max_body_size 10M;
}
NGINX

# Enable site
sudo ln -s /etc/nginx/sites-available/safestop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Configure Domain and SSL

```bash
# Point your domain's A record to your droplet IP:
# api.safestop.com -> YOUR_DROPLET_IP

# Install Certbot for Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.safestop.com

# Auto-renewal is configured automatically
# Verify:
sudo certbot renew --dry-run
```

### Step 9: Set Up DO Spaces (Photo Storage)

1. Go to DigitalOcean Console > Spaces.
2. Create a new Space:
   - **Name**: `safestop-photos`
   - **Region**: Same as droplet
   - **CDN**: Enabled
3. Create API key:
   - Go to API > Spaces Keys.
   - Generate new key, save the Key and Secret.
4. Add to `.env`:
   ```
   DO_SPACES_KEY=your-spaces-key
   DO_SPACES_SECRET=your-spaces-secret
   DO_SPACES_BUCKET=safestop-photos
   DO_SPACES_REGION=nyc3
   DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
   ```

### Step 10: Set Up Automated Backups

```bash
# Create backup script
mkdir -p /home/safestop/backups
cat > /home/safestop/backup.sh << 'BACKUP'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/safestop/backups"

# Dump database
pg_dump -U safestop safestop_db > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "db_*.sql" -mtime +7 -delete

echo "Backup completed: db_$TIMESTAMP.sql"
BACKUP
chmod +x /home/safestop/backup.sh

# Schedule daily backup at 3 AM
(crontab -l 2>/dev/null; echo "0 3 * * * /home/safestop/backup.sh") | crontab -
```

### Deployment Updates

For subsequent deployments:

```bash
cd /home/safestop/safestop
git pull origin main
cd apps/web
npm install
npx drizzle-kit push  # run migrations if schema changed
npm run build
pm2 restart safestop-api
```

---

## 5. Environment Variables

### Mobile App (`apps/mobile`)

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `https://api.safestop.com` |
| `EXPO_PUBLIC_WEB_URL` | Web portal URL | `https://app.safestop.com` |

Set in `apps/mobile/app.config.ts`:

```typescript
export default {
  expo: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
      webUrl: process.env.EXPO_PUBLIC_WEB_URL ?? 'http://localhost:3001',
    },
  },
};
```

### Web / API (`apps/web`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | Auth encryption key (64+ chars) | Random string |
| `BETTER_AUTH_URL` | Auth callback base URL | `https://api.safestop.com` |
| `EXPO_PUSH_TOKEN` | Expo push notification token | From expo.dev |
| `DO_SPACES_KEY` | DigitalOcean Spaces access key | From DO console |
| `DO_SPACES_SECRET` | DigitalOcean Spaces secret key | From DO console |
| `DO_SPACES_BUCKET` | Spaces bucket name | `safestop-photos` |
| `DO_SPACES_REGION` | Spaces region | `nyc3` |
| `DO_SPACES_ENDPOINT` | Spaces endpoint URL | `https://nyc3.digitaloceanspaces.com` |
| `NODE_ENV` | Runtime environment | `production` |

---

## 6. Post-Deployment Checklist

### Web Portal

- [ ] Production URL is accessible
- [ ] SSL certificate is valid (green lock)
- [ ] PWA manifest loads correctly
- [ ] Service worker registers
- [ ] SSE connection establishes for realtime updates
- [ ] Login/signup flow works end-to-end

### iOS App

- [ ] App launches on physical device via TestFlight
- [ ] Push notifications are received
- [ ] Camera opens and captures photos
- [ ] Background location tracking works
- [ ] App recovers from background/killed state
- [ ] Deep links open correct screens

### Android App

- [ ] APK installs on physical device
- [ ] Push notifications are received
- [ ] Camera permission prompt appears and works
- [ ] Background location permission granted
- [ ] App survives process death
- [ ] Deep links open correct screens

### Backend

- [ ] API responds to health check (`GET /api/health`)
- [ ] Database migrations applied successfully
- [ ] PostgreSQL connections pool correctly
- [ ] Photo uploads to DO Spaces work
- [ ] SSE stream delivers events
- [ ] PM2 auto-restarts on crash
- [ ] Nginx proxy passes correctly
- [ ] SSL auto-renewal configured
- [ ] Daily database backups running
- [ ] Firewall only allows ports 22, 80, 443

### Monitoring

- [ ] PM2 logs accessible (`pm2 logs safestop-api`)
- [ ] Nginx access/error logs at `/var/log/nginx/`
- [ ] PostgreSQL logs at `/var/log/postgresql/`
- [ ] DigitalOcean monitoring enabled (free)
- [ ] Uptime check configured (e.g., UptimeRobot, free tier)
