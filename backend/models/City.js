const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define('City', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 50
    }
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Trips',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  arrivalDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: true
    }
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: true,
      isAfterArrival(value) {
        if (this.arrivalDate && value && new Date(value) <= new Date(this.arrivalDate)) {
          throw new Error('Departure date must be after arrival date');
        }
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  estimatedBudget: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  actualSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true,
  paranoid: true,
  indexes: [
    { 
      fields: ['tripId'],
      name: 'cities_trip_id_index'
    },
    { 
      fields: ['name', 'country'],
      name: 'cities_name_country_index'
    },
    { 
      fields: ['tripId', 'order'],
      name: 'cities_trip_order_index',
      unique: true
    },
    {
      fields: ['arrivalDate'],
      name: 'cities_arrival_date_index'
    },
    {
      fields: ['departureDate'],
      name: 'cities_departure_date_index'
    }
  ],
  hooks: {
    beforeValidate: (city) => {
      // Ensure order is set
      if (!city.order) {
        city.order = 1;
      }
    }
  }
});

module.exports = City;