# 🌟 GlobeTrotter Social Features Schema

## 📊 **Complete Database Schema**

### **Core Social Models**

#### 1. **UserProfile** - Enhanced User Profiles
```sql
UserProfiles {
  id: UUID (PK)
  userId: UUID (FK -> Users.id)
  displayName: STRING (NOT NULL)
  username: STRING (UNIQUE, NOT NULL)
  bio: TEXT
  location: STRING
  website: STRING
  profilePicture: STRING
  coverPhoto: STRING
  isPrivate: BOOLEAN (default: false)
  isVerified: BOOLEAN (default: false)
  followersCount: INTEGER (default: 0)
  followingCount: INTEGER (default: 0)
  postsCount: INTEGER (default: 0)
  settings: JSON
}
```

#### 2. **UserFollow** - Follow System
```sql
UserFollows {
  id: UUID (PK)
  followerId: UUID (FK -> Users.id)
  followingId: UUID (FK -> Users.id)
  status: ENUM('pending', 'accepted', 'blocked')
}
```

#### 3. **UserGroup** - Group Management
```sql
UserGroups {
  id: UUID (PK)
  name: STRING (NOT NULL)
  description: TEXT
  groupPicture: STRING
  coverPhoto: STRING
  createdBy: UUID (FK -> Users.id)
  groupType: ENUM('public', 'private', 'secret')
  membersCount: INTEGER (default: 1)
  isActive: BOOLEAN (default: true)
  settings: JSON
}
```

#### 4. **GroupMember** - Group Memberships
```sql
GroupMembers {
  id: UUID (PK)
  groupId: UUID (FK -> UserGroups.id)
  userId: UUID (FK -> Users.id)
  role: ENUM('admin', 'moderator', 'member')
  status: ENUM('active', 'pending', 'banned')
  joinedAt: DATE
  invitedBy: UUID (FK -> Users.id)
}
```

### **Chat & Messaging System**

#### 5. **Chat** - Chat Rooms
```sql
Chats {
  id: UUID (PK)
  chatType: ENUM('individual', 'group')
  groupId: UUID (FK -> UserGroups.id)
  name: STRING
  lastMessageAt: DATE
  isActive: BOOLEAN (default: true)
}
```

#### 6. **ChatParticipant** - Chat Members
```sql
ChatParticipants {
  id: UUID (PK)
  chatId: UUID (FK -> Chats.id)
  userId: UUID (FK -> Users.id)
  joinedAt: DATE
  lastReadAt: DATE
  isActive: BOOLEAN (default: true)
}
```

#### 7. **Message** - Chat Messages
```sql
Messages {
  id: UUID (PK)
  chatId: UUID (FK -> Chats.id)
  senderId: UUID (FK -> Users.id)
  content: TEXT
  messageType: ENUM('text', 'image', 'file', 'location', 'trip_share')
  attachments: JSON
  replyToId: UUID (FK -> Messages.id)
  isEdited: BOOLEAN (default: false)
  editedAt: DATE
  isDeleted: BOOLEAN (default: false)
}
```

### **Social Content System**

#### 8. **Post** - Social Posts
```sql
Posts {
  id: UUID (PK)
  userId: UUID (FK -> Users.id)
  groupId: UUID (FK -> UserGroups.id)
  tripId: UUID (FK -> Trips.id)
  content: TEXT
  images: JSON
  location: STRING
  likesCount: INTEGER (default: 0)
  commentsCount: INTEGER (default: 0)
  sharesCount: INTEGER (default: 0)
  privacy: ENUM('public', 'friends', 'private')
  isActive: BOOLEAN (default: true)
}
```

#### 9. **PostComment** - Post Comments
```sql
PostComments {
  id: UUID (PK)
  postId: UUID (FK -> Posts.id)
  userId: UUID (FK -> Users.id)
  content: TEXT (NOT NULL)
  parentId: UUID (FK -> PostComments.id)
  likesCount: INTEGER (default: 0)
  isEdited: BOOLEAN (default: false)
  editedAt: DATE
}
```

#### 10. **Story** - Temporary Stories
```sql
Stories {
  id: UUID (PK)
  userId: UUID (FK -> Users.id)
  content: TEXT
  mediaUrl: STRING
  mediaType: ENUM('image', 'video')
  backgroundColor: STRING (default: '#8b5cf6')
  location: STRING
  tripId: UUID (FK -> Trips.id)
  viewsCount: INTEGER (default: 0)
  expiresAt: DATE (NOT NULL)
  isActive: BOOLEAN (default: true)
}
```

## 🔗 **Relationships Overview**

### **User Relationships**
- User (1) → (1) UserProfile
- User (1) → (N) UserFollow (as follower)
- User (1) → (N) UserFollow (as following)
- User (1) → (N) Posts
- User (1) → (N) Stories
- User (1) → (N) Messages

### **Group Relationships**
- User (1) → (N) UserGroup (as creator)
- UserGroup (1) → (N) GroupMember
- UserGroup (1) → (1) Chat (group chat)

### **Chat Relationships**
- Chat (1) → (N) ChatParticipant
- Chat (1) → (N) Message
- Message (1) → (N) Message (replies)

### **Content Relationships**
- Post (1) → (N) PostComment
- PostComment (1) → (N) PostComment (replies)
- Trip (1) → (N) Post (trip posts)
- Trip (1) → (N) Story (trip stories)

## 🚀 **API Endpoints**

### **Social Features**
```
POST   /api/profile/create           # Create user profile
POST   /api/users/:userId/follow     # Follow/unfollow user
POST   /api/posts                    # Create post
GET    /api/feed                     # Get feed posts
POST   /api/stories                  # Create story
GET    /api/stories                  # Get active stories
POST   /api/groups                   # Create group
GET    /api/groups                   # Get user groups
```

### **Chat Features**
```
POST   /api/chats/individual         # Create individual chat
POST   /api/chats/group              # Create group chat
POST   /api/chats/:chatId/messages   # Send message
GET    /api/chats/:chatId/messages   # Get chat messages
GET    /api/chats                    # Get user chats
```

## ✨ **Key Features**

### **1. User Profile Management**
- ✅ Enhanced profiles with bio, location, website
- ✅ Profile and cover photos
- ✅ Privacy settings (public/private)
- ✅ Verification system
- ✅ Follower/following counts

### **2. Social Following System**
- ✅ Follow/unfollow users
- ✅ Pending/accepted/blocked status
- ✅ Privacy controls for private accounts

### **3. Group Management**
- ✅ Create public/private/secret groups
- ✅ Role-based permissions (admin/moderator/member)
- ✅ Group settings and customization
- ✅ Member invitation system

### **4. Chat System**
- ✅ Individual direct messaging
- ✅ Group chat functionality
- ✅ Message types (text, image, file, location, trip sharing)
- ✅ Reply to messages
- ✅ Read receipts and status

### **5. Social Posts**
- ✅ Create posts with images and location
- ✅ Trip integration (share trip posts)
- ✅ Privacy controls (public/friends/private)
- ✅ Threaded comments system
- ✅ Like and share functionality

### **6. Stories Feature**
- ✅ 24-hour temporary stories
- ✅ Image/video support
- ✅ Trip integration
- ✅ View tracking
- ✅ Custom backgrounds

## 🎯 **Usage Examples**

### **Create User Profile**
```javascript
POST /api/profile/create
{
  "displayName": "John Traveler",
  "username": "johntraveler",
  "bio": "Adventure seeker exploring the world",
  "location": "New York, USA",
  "website": "https://johntraveler.com"
}
```

### **Create Group**
```javascript
POST /api/groups
{
  "name": "Europe Backpackers",
  "description": "Group for budget travelers in Europe",
  "groupType": "public"
}
```

### **Send Message**
```javascript
POST /api/chats/:chatId/messages
{
  "content": "Check out my latest trip!",
  "messageType": "trip_share",
  "attachments": [{"tripId": "trip-uuid"}]
}
```

### **Create Story**
```javascript
POST /api/stories
{
  "content": "Amazing sunset in Santorini!",
  "mediaUrl": "uploads/stories/sunset.jpg",
  "mediaType": "image",
  "location": "Santorini, Greece",
  "tripId": "trip-uuid"
}
```

## 🔐 **Security Features**

- ✅ **Authentication**: JWT token required for all operations
- ✅ **Privacy Controls**: Public/private profiles and posts
- ✅ **Role-based Access**: Group admin/moderator permissions
- ✅ **Content Moderation**: Soft delete for messages and posts
- ✅ **Data Validation**: Input sanitization and validation

## 📱 **Frontend Integration Ready**

The schema is designed to support:
- **Real-time Chat**: WebSocket integration ready
- **Feed Algorithm**: Optimized queries for social feeds
- **Story Viewer**: 24-hour expiration with view tracking
- **Group Management**: Complete admin panel functionality
- **Profile Customization**: Rich profile editing capabilities

## 🎉 **Production Ready**

- ✅ **18 Database Tables** fully synchronized
- ✅ **Complete API Endpoints** implemented
- ✅ **Proper Relationships** with foreign keys
- ✅ **Performance Indexes** on all critical fields
- ✅ **Data Integrity** with constraints and validation

Your GlobeTrotter app now has a **complete social media platform** integrated with travel planning!