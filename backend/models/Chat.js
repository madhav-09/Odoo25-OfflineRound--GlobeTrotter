const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  chatType: {
    type: DataTypes.ENUM('individual', 'group'),
    allowNull: false
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'UserGroups',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['chatType'] },
    { fields: ['groupId'] },
    { fields: ['lastMessageAt'] }
  ]
});

module.exports = Chat;