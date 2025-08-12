const { Activity, City, Trip, User } = require('../models');

const activityTemplates = [
  // Sightseeing
  { name: 'Visit Eiffel Tower', category: 'sightseeing', cost: 25, description: 'Iconic iron tower with city views' },
  { name: 'Explore Louvre Museum', category: 'sightseeing', cost: 17, description: 'World famous art museum' },
  { name: 'Walk along Seine River', category: 'sightseeing', cost: 0, description: 'Scenic riverside walk' },
  { name: 'Visit Notre-Dame Cathedral', category: 'sightseeing', cost: 0, description: 'Gothic architecture masterpiece' },
  { name: 'Tokyo Skytree Observatory', category: 'sightseeing', cost: 30, description: 'Tallest tower in Japan' },
  { name: 'Senso-ji Temple', category: 'sightseeing', cost: 0, description: 'Ancient Buddhist temple' },
  { name: 'Central Park Walk', category: 'sightseeing', cost: 0, description: 'Urban oasis in Manhattan' },
  { name: 'Statue of Liberty', category: 'sightseeing', cost: 23, description: 'Symbol of freedom' },
  
  // Food & Dining
  { name: 'French Bistro Dinner', category: 'food', cost: 45, description: 'Authentic French cuisine' },
  { name: 'Street Food Tour', category: 'food', cost: 35, description: 'Local street food experience' },
  { name: 'Sushi Omakase', category: 'food', cost: 80, description: 'Chef\'s choice sushi experience' },
  { name: 'Ramen Tasting', category: 'food', cost: 15, description: 'Traditional Japanese ramen' },
  { name: 'Pizza Tour', category: 'food', cost: 25, description: 'Best pizza spots in the city' },
  { name: 'Coffee Shop Hopping', category: 'food', cost: 20, description: 'Local coffee culture' },
  
  // Entertainment
  { name: 'Broadway Show', category: 'entertainment', cost: 120, description: 'World-class theater performance' },
  { name: 'Jazz Club Evening', category: 'entertainment', cost: 40, description: 'Live jazz music experience' },
  { name: 'Museum Night Tour', category: 'entertainment', cost: 35, description: 'After-hours museum experience' },
  { name: 'River Cruise', category: 'entertainment', cost: 50, description: 'Scenic boat tour' },
  { name: 'Karaoke Night', category: 'entertainment', cost: 25, description: 'Japanese karaoke experience' },
  
  // Shopping
  { name: 'Local Market Visit', category: 'shopping', cost: 30, description: 'Traditional local market' },
  { name: 'Souvenir Shopping', category: 'shopping', cost: 50, description: 'Unique local souvenirs' },
  { name: 'Fashion District Tour', category: 'shopping', cost: 0, description: 'Explore fashion boutiques' },
  
  // Transport
  { name: 'Airport Transfer', category: 'transport', cost: 40, description: 'Transportation to/from airport' },
  { name: 'City Metro Pass', category: 'transport', cost: 15, description: 'Daily public transport pass' },
  { name: 'Taxi Ride', category: 'transport', cost: 20, description: 'Local taxi transportation' },
  
  // Accommodation
  { name: 'Hotel Stay', category: 'accommodation', cost: 150, description: 'Comfortable hotel accommodation' },
  { name: 'Hostel Bed', category: 'accommodation', cost: 35, description: 'Budget-friendly hostel' },
  { name: 'Airbnb Apartment', category: 'accommodation', cost: 80, description: 'Local apartment rental' }
];

const seedActivities = async () => {
  try {
    console.log('Seeding activity templates...');
    
    // This is just for reference - activities will be created per trip
    // The templates above can be used in the frontend for suggestions
    
    console.log('Activity templates ready for use');
  } catch (error) {
    console.error('Error seeding activities:', error);
  }
};

module.exports = { seedActivities, activityTemplates };