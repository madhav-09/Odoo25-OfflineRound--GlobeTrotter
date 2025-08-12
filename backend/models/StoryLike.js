const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoryLike = sequelize.define('StoryLike', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  storyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Stories',
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
  }
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ['storyId', 'userId'] }
  ]
});

module.exports = StoryLike;