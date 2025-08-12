const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Validate environment variables
const validateEnvironment = require('./config/validate-env');
validateEnvironment();

const sequelize = require('./config/database');
const dbHealth = require('./config/database-health');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const cityRoutes = require('./routes/cities');
const activityRoutes = require('./routes/activities');
const budgetRoutes = require('./routes/budget');
const collaborationRoutes = require('./routes/collaboration');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/users');
const socialRoutes = require('./routes/social');
const chatRoutes = require('./routes/chat');
const syncRoutes = require('./routes/sync');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api', budgetRoutes);
app.use('/api', collaborationRoutes);
app.use('/api', profileRoutes);
app.use('/api', userRoutes);
app.use('/api', socialRoutes);
app.use('/api', chatRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await dbHealth.checkHealth();
    const connectionCount = await dbHealth.getConnectionCount();
    const tableInfo = await dbHealth.getTableInfo();
    
    res.json({ 
      status: dbStatus ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      database: {
        healthy: dbStatus,
        connections: connectionCount,
        tables: tableInfo.length
      },
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  
  // Don't expose internal errors in production
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
    
  res.status(err.status || 500).json({ 
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    require('./models');
    
    // Simple database setup - no complex migrations
    console.log('🔄 Setting up database...');
    
    // Check if tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    if (tables.length === 0) {
      console.log('🔄 Creating basic tables...');
      await sequelize.sync({ force: false });
      console.log('✅ Basic tables created');
    } else {
      console.log('✅ Tables already exist');
    }
    
    // Initialize city templates
    const { seedCityTemplates } = require('./seeders/city-templates');
    await seedCityTemplates();
    
    // Initialize activity templates
    const { seedActivities } = require('./seeders/activities');
    await seedActivities();
    
    // Initialize travel stories
    const { seedTravelStories } = require('./seeders/travel-stories');
    await seedTravelStories();
    
    // Start database health monitoring
    dbHealth.startMonitoring();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    process.exit(1);
  }
};

startServer();