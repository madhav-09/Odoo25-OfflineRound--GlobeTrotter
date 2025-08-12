const { User } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { cognitoId: req.user.cognitoId },
      attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture', 'bio', 'preferences', 'role', 'createdAt', 'lastLoginAt']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last login time
    await user.update({ lastLoginAt: new Date() });

    // Ensure profile picture path is properly returned
    const userData = user.toJSON();
    console.log('Profile picture from DB:', userData.profilePicture);

    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, preferences } = req.body;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;

    await user.update(updateData);
    
    const updatedUser = await User.findByPk(user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture', 'bio', 'preferences', 'createdAt']
    });

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const profilePicturePath = `uploads/profiles/${req.file.filename}`;
    
    // Update both User and UserProfile tables
    await user.update({ profilePicture: profilePicturePath });
    
    // Also update UserProfile if it exists
    const { UserProfile } = require('../models');
    const userProfile = await UserProfile.findOne({ where: { userId: user.id } });
    if (userProfile) {
      await userProfile.update({ profilePicture: profilePicturePath });
    }

    res.json({ 
      profilePicture: profilePicturePath,
      message: 'Profile picture updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  upload
};