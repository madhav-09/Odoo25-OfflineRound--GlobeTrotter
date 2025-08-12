const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityMember = sequelize.define('CommunityMember', {
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
  communityId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('member', 'moderator', 'admin'),
    defaultValue: 'member'
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['communityId'] },
    { unique: true, fields: ['userId', 'communityId'] }
  ]
});

module.exports = CommunityMember;