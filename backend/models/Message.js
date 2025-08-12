const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  chatId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow null for community messages
    references: {
      model: 'Chats',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: true, // For community group messages
    defaultValue: null
  },
  senderId: {
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
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'location', 'trip_share'),
    defaultValue: 'text'
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  replyToId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Messages',
      key: 'id'
    }
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['chatId'] },
    { fields: ['senderId'] },
    { fields: ['createdAt'] },
    { fields: ['replyToId'] }
  ]
});

module.exports = Message;