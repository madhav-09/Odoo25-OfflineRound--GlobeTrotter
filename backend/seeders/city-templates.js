// City templates for the frontend to use when creating trips
const cityTemplates = [
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Barcelona', country: 'Spain', latitude: 41.3851, longitude: 2.1734 },
  { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018 }
];

const seedCityTemplates = async () => {
  try {
    console.log('City templates ready for use');
    return cityTemplates;
  } catch (error) {
    console.error('Error with city templates:', error);
  }
};

module.exports = { seedCityTemplates, cityTemplates };