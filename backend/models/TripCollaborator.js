const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripCollaborator = sequelize.define('TripCollaborator', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Trips',
      key: 'id'
    },
    onDelete: 'CASCADE'
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
  role: {
    type: DataTypes.ENUM('viewer', 'editor', 'admin'),
    defaultValue: 'viewer'
  },
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending'
  },
  invitedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['tripId'] },
    { fields: ['userId'] },
    { fields: ['status'] },
    { unique: true, fields: ['tripId', 'userId'] }
  ]
});

module.exports = TripCollaborator;