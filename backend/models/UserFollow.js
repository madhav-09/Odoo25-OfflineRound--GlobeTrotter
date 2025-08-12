const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserFollow = sequelize.define('UserFollow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
    defaultValue: 'accepted'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['followerId'] },
    { fields: ['followingId'] },
    { fields: ['status'] },
    { unique: true, fields: ['followerId', 'followingId'] }
  ]
});

module.exports = UserFollow;