const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cognitoId: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: { 
      isEmail: true,
      notEmpty: true
    }
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  profilePicture: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  preferences: {
    type: DataTypes.JSONB, // Use JSONB for PostgreSQL performance
    defaultValue: {
      currency: 'USD',
      language: 'en',
      timezone: 'UTC',
      notifications: true,
      theme: 'light'
    },
    validate: {
      isValidPreferences(value) {
        if (value && typeof value !== 'object') {
          throw new Error('Preferences must be an object');
        }
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator'),
    defaultValue: 'user',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    { 
      unique: true, 
      fields: ['cognitoId'],
      name: 'users_cognito_id_unique'
    },
    { 
      unique: true, 
      fields: ['email'],
      name: 'users_email_unique'
    },
    { 
      fields: ['role'],
      name: 'users_role_index'
    },
    { 
      fields: ['isActive'],
      name: 'users_is_active_index'
    },
    {
      fields: ['createdAt'],
      name: 'users_created_at_index'
    }
  ],
  hooks: {
    beforeCreate: (user) => {
      user.email = user.email.toLowerCase();
    },
    beforeUpdate: (user) => {
      if (user.changed('email')) {
        user.email = user.email.toLowerCase();
      }
    }
  }
});

module.exports = User;