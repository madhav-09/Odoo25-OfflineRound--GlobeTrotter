const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Friendship = sequelize.define('Friendship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  addresseeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'blocked', 'declined'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['requesterId'] },
    { fields: ['addresseeId'] },
    { fields: ['status'] },
    { unique: true, fields: ['requesterId', 'addresseeId'] }
  ],
  validate: {
    notSelfFriend() {
      if (this.requesterId === this.addresseeId) {
        throw new Error('Users cannot be friends with themselves');
      }
    }
  }
});

module.exports = Friendship;