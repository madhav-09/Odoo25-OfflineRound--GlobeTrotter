const { City } = require('../models');

const cities = [
  { name: 'Paris', country: 'France' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
  { name: 'Rome', country: 'Italy' },
  { name: 'Barcelona', country: 'Spain' },
  { name: 'Dubai', country: 'UAE' },
  { name: 'Bangkok', country: 'Thailand' }
];

const seedCities = async () => {
  try {
    for (const city of cities) {
      await City.findOrCreate({
        where: { name: city.name, country: city.country },
        defaults: { ...city, order: null }
      });
    }
    console.log('Cities seeded successfully');
  } catch (error) {
    console.error('Error seeding cities:', error);
  }
};

module.exports = seedCities;