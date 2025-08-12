const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterToday(value) {
        if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          throw new Error('Start date cannot be in the past');
        }
      }
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (this.startDate && new Date(value) <= new Date(this.startDate)) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  totalBudget: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 9999999999.99
    }
  },
  actualCost: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalSpent: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    allowNull: false,
    validate: {
      isIn: [['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR']]
    }
  },
  status: {
    type: DataTypes.ENUM('planning', 'confirmed', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'planning',
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  shareToken: {
    type: DataTypes.STRING(64),
    unique: true,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  customBudgets: {
    type: DataTypes.JSONB,
    defaultValue: [],
    allowNull: false
  },
  categoryBreakdown: {
    type: DataTypes.JSONB,
    defaultValue: {
      accommodation: 0,
      transportation: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      other: 0
    },
    allowNull: false
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
    allowNull: false,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Tags must be an array');
        }
      }
    }
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tripType: {
    type: DataTypes.ENUM('solo', 'couple', 'family', 'friends', 'business'),
    defaultValue: 'solo',
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: true,
  indexes: [
    { 
      fields: ['userId'],
      name: 'trips_user_id_index'
    },
    { 
      fields: ['startDate'],
      name: 'trips_start_date_index'
    },
    { 
      fields: ['endDate'],
      name: 'trips_end_date_index'
    },
    { 
      fields: ['status'],
      name: 'trips_status_index'
    },
    { 
      unique: true,
      fields: ['shareToken'],
      name: 'trips_share_token_unique',
      where: {
        shareToken: { [sequelize.Sequelize.Op.ne]: null }
      }
    },
    { 
      fields: ['isPublic'],
      name: 'trips_is_public_index'
    },
    {
      fields: ['createdAt'],
      name: 'trips_created_at_index'
    },
    {
      fields: ['userId', 'status'],
      name: 'trips_user_status_index'
    }
  ],
  hooks: {
    beforeValidate: (trip) => {
      // Auto-calculate trip duration and validate
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 365) {
          throw new Error('Trip duration cannot exceed 365 days');
        }
      }
    }
  }
});

module.exports = Trip;