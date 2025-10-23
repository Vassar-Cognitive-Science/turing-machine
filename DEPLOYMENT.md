# Deployment Guide

This guide covers local development setup, testing, and production deployment for the Turing Machine Simulator.

## 🚀 Quick Start

### Local Development with Database
```bash
npm run dev:full    # Starts MongoDB + development server
```

### Production Deployment
```bash
npm run deploy:prod # Build + deploy with PM2
```

## 📋 Prerequisites

- **Node.js** 18+ 
- **Docker** (for local MongoDB)
- **PM2** (for production): `npm install -g pm2`

## 🔧 Local Development

### 1. Database Setup
Start MongoDB container for local development:
```bash
npm run db:start    # Start MongoDB in Docker
npm run db:logs     # View database logs
npm run db:stop     # Stop MongoDB
npm run db:reset    # Reset database with fresh data
```

The database will be automatically initialized with:
- Sample machine states for testing
- Proper indexes for performance
- Test URLs: `http://localhost:3001/test123`, `http://localhost:3001/sample456`

### 2. Development Server
```bash
npm run dev         # Start development server only
npm run dev:full    # Start MongoDB + development server
```

### 3. Testing
```bash
npm test            # Run unit tests
npm run test:full   # Start DB + run all tests + stop DB
npm run test:watch  # Run tests in watch mode
```

## 🏭 Production Deployment

### 1. Environment Setup
Copy the production environment template:
```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your production values:
- `MONGODB_URL` - Your production MongoDB connection string
- `PORT` - Production port (default: 80)
- Other configuration as needed

### 2. PM2 Deployment
Deploy the application with PM2:
```bash
npm run deploy:prod  # Complete deployment: build + PM2 start
```

### 3. PM2 Management
```bash
npm run pm2:status   # Check application status
npm run pm2:logs     # View application logs
npm run pm2:restart  # Zero-downtime restart
npm run pm2:reload   # Graceful reload
npm run pm2:stop     # Stop application
npm run pm2:monit    # Open PM2 monitoring dashboard
```

### 4. Health Monitoring
Check application health:
```bash
npm run health       # Quick health check
curl http://localhost/api/health  # Detailed health status
```

Health endpoint returns:
```json
{
  "status": "ok",
  "timestamp": "2025-07-20T...",
  "uptime": 3600,
  "environment": "production",
  "services": {
    "server": "healthy",
    "database": "healthy"
  }
}
```

## 📊 Available Scripts

### Development
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:full` | Start MongoDB + development server |
| `npm run build` | Build for production |
| `npm run type-check` | TypeScript type checking |

### Database Management
| Script | Description |
|--------|-------------|
| `npm run db:start` | Start MongoDB container |
| `npm run db:stop` | Stop MongoDB container |
| `npm run db:reset` | Reset database with fresh data |
| `npm run db:logs` | View database logs |

### Testing
| Script | Description |
|--------|-------------|
| `npm test` | Run unit tests |
| `npm run test:full` | Run all tests with database |
| `npm run test:watch` | Run tests in watch mode |

### Production & PM2
| Script | Description |
|--------|-------------|
| `npm run deploy:prod` | Complete production deployment |
| `npm run pm2:start` | Start with PM2 |
| `npm run pm2:stop` | Stop PM2 process |
| `npm run pm2:restart` | Zero-downtime restart |
| `npm run pm2:reload` | Graceful reload |
| `npm run pm2:logs` | View application logs |
| `npm run pm2:monit` | PM2 monitoring dashboard |
| `npm run pm2:status` | Check PM2 status |

### Monitoring
| Script | Description |
|--------|-------------|
| `npm run health` | Application health check |

## 🐳 Docker Development

The project includes Docker Compose for local MongoDB:

```yaml
# docker-compose.dev.yml
services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
```

Benefits:
- ✅ Consistent MongoDB version across development environments
- ✅ Automatic database initialization with sample data
- ✅ Easy reset and cleanup
- ✅ No local MongoDB installation required

## 🔍 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
npm run db:logs

# Reset database if corrupted
npm run db:reset

# Check connection manually
docker exec -it turing-machine-mongodb-dev mongosh
```

### PM2 Issues
```bash
# Check PM2 process status
npm run pm2:status

# View detailed logs
npm run pm2:logs

# Kill and restart if stuck
npm run pm2:delete
npm run deploy:prod
```

### Health Check Failures
```bash
# Check application health
npm run health

# Check server logs
npm run pm2:logs

# Check database connectivity
curl http://localhost/api/health
```

## 📈 Production Monitoring

### PM2 Monitoring
- Built-in process monitoring with auto-restart
- Memory usage limits and restart policies
- Cluster mode support for high availability
- Log rotation and aggregation

### Health Endpoint
- Real-time server and database status
- Uptime and performance metrics
- Integration-ready for external monitoring tools

### Logs
- Structured JSON logging in production
- Separate error and output logs
- Automatic log rotation via PM2

## 🔒 Security Considerations

- Environment variables for sensitive configuration
- MongoDB connection timeouts to prevent hanging
- Process isolation via PM2
- Health checks for monitoring integration
- Graceful shutdown handling

## 📚 Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)