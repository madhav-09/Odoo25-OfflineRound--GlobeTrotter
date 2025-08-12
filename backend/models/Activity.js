const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
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
  category: {
    type: DataTypes.ENUM(
      'sightseeing', 
      'food', 
      'entertainment', 
      'shopping', 
      'transport', 
      'accommodation', 
      'adventure',
      'culture',
      'nature',
      'nightlife',
      'wellness',
      'business',
      'other'
    ),
    defaultValue: 'sightseeing',
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 99999999.99
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
    allowNull: true,
    validate: {
      min: 0,
      max: 1440 // Max 24 hours
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 100
    }
  },
  cityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Cities',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  location: {
    type: DataTypes.STRING(300),
    allowNull: true,
    validate: {
      len: [0, 300]
    }
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  bookingReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: true,
  indexes: [
    { 
      fields: ['cityId'],
      name: 'activities_city_id_index'
    },
    { 
      fields: ['date'],
      name: 'activities_date_index'
    },
    { 
      fields: ['category'],
      name: 'activities_category_index'
    },
    {
      fields: ['cityId', 'order'],
      name: 'activities_city_order_index',
      unique: true
    },
    {
      fields: ['cityId', 'date', 'time'],
      name: 'activities_city_datetime_index'
    },
    {
      fields: ['priority'],
      name: 'activities_priority_index'
    },
    {
      fields: ['isBooked'],
      name: 'activities_is_booked_index'
    }
  ],
  hooks: {
    beforeValidate: (activity) => {
      // Ensure order is set
      if (!activity.order) {
        activity.order = 1;
      }
    }
  }
});

module.exports = Activity;