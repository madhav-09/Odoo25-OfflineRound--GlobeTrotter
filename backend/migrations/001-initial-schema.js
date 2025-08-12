'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      cognitoId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      preferences: {
        type: Sequelize.JSON,
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create Trips table
    await queryInterface.createTable('Trips', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      totalBudget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      actualCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD'
      },
      status: {
        type: Sequelize.ENUM('planning', 'confirmed', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'planning'
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      shareToken: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      customBudgets: {
        type: Sequelize.JSON,
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create Cities table
    await queryInterface.createTable('Cities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tripId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Trips',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      arrivalDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      departureDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create Activities table
    await queryInterface.createTable('Activities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('sightseeing', 'food', 'entertainment', 'shopping', 'transport', 'accommodation', 'other'),
        allowNull: false
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      cityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create indexes for performance (with error handling for existing indexes)
    try {
      await queryInterface.addIndex('Users', ['cognitoId'], { name: 'users_cognito_id' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index users_cognito_id already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('Users', ['email'], { name: 'users_email' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index users_email already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('Trips', ['userId'], { name: 'trips_user_id' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index trips_user_id already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('Trips', ['shareToken'], { name: 'trips_share_token' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index trips_share_token already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('Cities', ['tripId'], { name: 'cities_trip_id' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index cities_trip_id already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('Activities', ['cityId'], { name: 'activities_city_id' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index activities_city_id already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('Activities', ['date'], { name: 'activities_date' });
    } catch (error) {
      if (!error.message.includes('already exists')) throw error;
      console.log('⚠️  Index activities_date already exists, skipping...');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Activities');
    await queryInterface.dropTable('Cities');
    await queryInterface.dropTable('Trips');
    await queryInterface.dropTable('Users');
  }
}; 