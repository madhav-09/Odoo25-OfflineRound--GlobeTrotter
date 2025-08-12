const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SharedTrip = sequelize.define('SharedTrip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shareToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

module.exports = SharedTrip;