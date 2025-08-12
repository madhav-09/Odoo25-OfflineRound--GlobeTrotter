const sequelize = require('./database');

class DatabaseHealth {
  constructor() {
    this.isHealthy = false;
    this.lastCheck = null;
    this.checkInterval = null;
  }

  async checkHealth() {
    try {
      await sequelize.authenticate();
      this.isHealthy = true;
      this.lastCheck = new Date();
      return true;
    } catch (error) {
      this.isHealthy = false;
      this.lastCheck = new Date();
      console.error('❌ Database health check failed:', error.message);
      return false;
    }
  }

  async getConnectionCount() {
    try {
      const [results] = await sequelize.query('SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()');
      return results[0].count;
    } catch (error) {
      console.error('Failed to get connection count:', error.message);
      return null;
    }
  }

  async getTableInfo() {
    try {
      const [results] = await sequelize.query(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `);
      return results;
    } catch (error) {
      console.error('Failed to get table info:', error.message);
      return [];
    }
  }

  startMonitoring(intervalMs = 30000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      await this.checkHealth();
    }, intervalMs);

    console.log(`🔍 Database health monitoring started (${intervalMs}ms intervals)`);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🛑 Database health monitoring stopped');
    }
  }

  getStatus() {
    return {
      isHealthy: this.isHealthy,
      lastCheck: this.lastCheck,
      isMonitoring: !!this.checkInterval
    };
  }
}

module.exports = new DatabaseHealth(); 