const { User } = require('../models');

const getOrCreateUser = async (req, res) => {
  try {
    const { cognitoId, email, firstName, lastName } = req.body;

    const [user, created] = await User.findOrCreate({
      where: { cognitoId },
      defaults: {
        cognitoId,
        email,
        firstName,
        lastName
      }
    });
    
    // Update user info if it already existed
    if (!created) {
      await user.update({ email, firstName, lastName });
    }

    res.json({ user });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { cognitoId: req.user.cognitoId } 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrCreateUser,
  getProfile
};