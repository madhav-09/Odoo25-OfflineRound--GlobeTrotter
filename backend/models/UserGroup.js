const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserGroup = sequelize.define('UserGroup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  groupPicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  coverPhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  groupType: {
    type: DataTypes.ENUM('public', 'private', 'secret'),
    defaultValue: 'public'
  },
  membersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {
      allowMemberInvites: true,
      requireApproval: false,
      allowPosts: true,
      allowComments: true
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['createdBy'] },
    { fields: ['groupType'] },
    { fields: ['isActive'] }
  ]
});

module.exports = UserGroup;