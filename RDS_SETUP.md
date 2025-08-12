# AWS RDS PostgreSQL Setup Guide

## 1. Create RDS Instance

### AWS Console Steps:
1. Go to **AWS RDS Console** → https://console.aws.amazon.com/rds/
2. Click **"Create database"**
3. Choose **"Standard create"**

### Database Configuration:
```
Engine: PostgreSQL
Version: PostgreSQL 15.x (latest)
Templates: Free tier (for development)
```

### Settings:
```
DB instance identifier: globetrotter-db
Master username: postgres
Master password: [Create strong password]
```

### Instance Configuration:
```
DB instance class: db.t3.micro (free tier)
Storage type: General Purpose SSD (gp2)
Allocated storage: 20 GB
```

### Connectivity:
```
VPC: Default VPC
Subnet group: default
Public access: Yes (for development)
VPC security group: Create new
Security group name: globetrotter-sg
```

### Database Options:
```
Initial database name: globetrotter
Port: 5432
```

## 2. Configure Security Group

### After RDS creation:
1. Go to **EC2 Console** → **Security Groups**
2. Find **globetrotter-sg**
3. Click **"Edit inbound rules"**
4. Add rule:
   ```
   Type: PostgreSQL
   Protocol: TCP
   Port: 5432
   Source: My IP (your current IP)
   ```

## 3. Get Connection Details

### From RDS Console:
1. Click your **globetrotter-db** instance
2. Copy **Endpoint** (looks like: globetrotter-db.xxxxxxxxx.region.rds.amazonaws.com)

## 4. Update Backend .env

```env
DB_HOST=globetrotter-db.xxxxxxxxx.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=globetrotter
DB_USER=postgres
DB_PASSWORD=your-master-password
```

## 5. Test Connection

```bash
cd backend
npm run dev
```

Should see: "Database connected successfully"

## Quick Setup Commands

```bash
# Install PostgreSQL client (optional, for testing)
brew install postgresql

# Test connection
psql -h your-endpoint -U postgres -d globetrotter
```

## Troubleshooting

**Connection timeout:**
- Check security group allows your IP
- Ensure "Public access" is enabled

**Authentication failed:**
- Verify username/password
- Check database name exists

**Network error:**
- Confirm endpoint is correct
- Check VPC/subnet configuration