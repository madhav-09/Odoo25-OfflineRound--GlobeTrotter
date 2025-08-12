# Profile Access Guide - GlobeTrotter

## 🎯 **How to Access Profile**

### **Method 1: From Header (Mobile)**
1. Click the **hamburger menu** (three lines) in the top right
2. Click **"Profile"** in the mobile navigation menu
3. You'll be taken to `/profile`

### **Method 2: Direct URL**
Navigate directly to: `http://localhost:3000/profile`

## ✨ **Profile Features**

### **1. Profile Picture Upload**
- Click the **camera icon** on your profile picture
- Select an image file (JPG, PNG, GIF up to 5MB)
- Image automatically uploads and syncs to database
- Displays immediately after upload

### **2. Edit Profile Information**
- Click **"Edit Profile"** button
- Update:
  - First Name
  - Last Name  
  - Bio/Description
- Click **"Save"** to sync changes to database
- Click **"Cancel"** to discard changes

### **3. Travel Statistics**
- **Total Trips**: Number of trips created
- **Cities Visited**: Total cities across all trips
- **Countries**: Unique countries visited
- **Upcoming**: Future trips planned

### **4. Contact Information**
- Email address (from Cognito)
- Join date (account creation)
- Location (from preferences)

## 🔧 **Database Sync**

### **What Gets Saved**
```json
{
  "firstName": "Updated name",
  "lastName": "Updated surname", 
  "bio": "Travel enthusiast...",
  "profilePicture": "uploads/profiles/profile-123456.jpg",
  "preferences": {
    "currency": "USD",
    "language": "en",
    "timezone": "UTC"
  },
  "lastLoginAt": "2024-01-15T10:30:00Z"
}
```

### **API Endpoints Used**
```
GET  /api/profile           # Fetch profile data
PUT  /api/profile           # Update profile info
POST /api/profile/picture   # Upload profile picture
```

## 🎨 **UI Features**

### **Profile Picture Display**
- Shows uploaded image if available
- Falls back to initials avatar if no image
- Camera icon for easy upload access
- Loading states during upload

### **Edit Mode**
- Inline editing with form fields
- Save/Cancel buttons
- Loading indicators
- Error handling

### **Responsive Design**
- Works on desktop and mobile
- Optimized layouts for different screen sizes
- Touch-friendly upload button

## 🔐 **Security & Validation**

### **File Upload Security**
- Only image files allowed (JPG, PNG, GIF)
- 5MB file size limit
- Secure file naming with timestamps
- Old images automatically deleted

### **Data Validation**
- Required field validation
- Input sanitization
- Authentication required for all operations

## 🚀 **Quick Start**

1. **Access Profile**: Click hamburger menu → Profile
2. **Upload Photo**: Click camera icon → Select image
3. **Edit Info**: Click "Edit Profile" → Make changes → Save
4. **View Stats**: Scroll down to see travel statistics

## 📱 **Mobile Access**

Since the profile link is in the mobile navigation:

1. **Open mobile menu** (hamburger icon)
2. **Scroll down** to find "Profile" 
3. **Tap "Profile"** to access your profile page
4. **All features work** the same on mobile

## ✅ **Success Indicators**

- ✅ Profile picture updates immediately
- ✅ "Profile updated successfully" (implicit)
- ✅ Changes persist after page refresh
- ✅ Data synced to PostgreSQL database
- ✅ Last login time tracked

Your profile is now fully functional with database synchronization and photo upload capabilities!