const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Story = sequelize.define('Story', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: true
  },
  backgroundColor: {
    type: DataTypes.STRING,
    defaultValue: '#8b5cf6'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Trips',
      key: 'id'
    }
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['expiresAt'] },
    { fields: ['isActive'] },
    { fields: ['tripId'] }
  ]
});

module.exports = Story;