# How to Access Collaborator Features in GlobeTrotter

## 🚀 **Quick Access Methods**

### **Method 1: From Trip Details Page**
1. Go to **My Trips** (`/trips`)
2. Click on any trip to view details
3. Click the **"Collaborate"** button in the action bar
4. You'll be taken to `/trips/{tripId}/collaborate`

### **Method 2: Direct URL Access**
Navigate directly to: `http://localhost:3000/trips/{tripId}/collaborate`
- Replace `{tripId}` with your actual trip ID

### **Method 3: From Trip Planning**
1. While planning a trip (`/trips/{tripId}/plan`)
2. Look for collaboration options in the trip menu
3. Click **"Collaborate"** to invite others

## 🎯 **Collaboration Features Available**

### **1. Invite Collaborators**
- **Email Invitation**: Enter email address of person to invite
- **Role Selection**: Choose from Viewer, Editor, or Admin
- **Status Tracking**: See pending, accepted, or declined invitations

### **2. Manage Collaborators**
- **View All Collaborators**: See everyone with access to the trip
- **Role Management**: Update permissions for existing collaborators
- **Status Monitoring**: Track invitation responses

### **3. Trip Comments & Discussion**
- **Add Comments**: Start discussions about the trip
- **Reply System**: Threaded conversations (coming soon)
- **Real-time Updates**: See latest comments from team members

### **4. Recent Changes Tracking**
- **Activity Log**: See who made what changes
- **Change History**: Track modifications to the trip
- **Collaboration Timeline**: View team activity

## 🔧 **API Endpoints Used**

The collaboration system uses these backend endpoints:

```
POST   /api/trips/:tripId/collaborators  # Invite collaborator
GET    /api/trips/:tripId/collaborators  # Get collaborators
POST   /api/trips/:tripId/comments       # Add comment
GET    /api/trips/:tripId/comments       # Get comments
```

## 📱 **User Interface**

### **Collaboration Page Layout**
```
┌─────────────────────────────────────┐
│ Collaborate on "Trip Name"          │
├─────────────────────────────────────┤
│ 👥 Collaborators (2)                │
│ ┌─────────────────────────────────┐ │
│ │ Email: [input] Role: [select]   │ │
│ │ [Invite Button]                 │ │
│ └─────────────────────────────────┘ │
│ • John Doe (Editor) - Accepted      │
│ • Jane Smith (Viewer) - Pending     │
├─────────────────────────────────────┤
│ 💬 Comments & Discussion            │
│ ┌─────────────────────────────────┐ │
│ │ [Comment textarea]              │ │
│ │ [Add Comment Button]            │ │
│ └─────────────────────────────────┘ │
│ • John: "Great itinerary!"          │
│ • Jane: "Should we add more time?"  │
├─────────────────────────────────────┤
│ 📝 Recent Changes                   │
│ • John added Paris to itinerary     │
│ • Jane updated budget for Rome      │
└─────────────────────────────────────┘
```

## 🎨 **Visual Indicators**

### **Status Colors**
- 🟡 **Pending**: Yellow/Orange
- 🟢 **Accepted**: Green
- 🔴 **Declined**: Red

### **Role Badges**
- **Viewer**: Can only view the trip
- **Editor**: Can modify trip details
- **Admin**: Full access including collaborator management

## 🔐 **Permissions System**

### **Role Capabilities**
| Feature | Viewer | Editor | Admin |
|---------|--------|--------|-------|
| View Trip | ✅ | ✅ | ✅ |
| Add Comments | ✅ | ✅ | ✅ |
| Edit Itinerary | ❌ | ✅ | ✅ |
| Manage Budget | ❌ | ✅ | ✅ |
| Invite Others | ❌ | ❌ | ✅ |
| Remove Collaborators | ❌ | ❌ | ✅ |

## 🚀 **Getting Started**

### **Step 1: Create a Trip**
```bash
# Navigate to create trip
http://localhost:3000/trips/new
```

### **Step 2: Access Collaboration**
```bash
# Go to trip details first
http://localhost:3000/trips/{tripId}

# Then click "Collaborate" button
# Or navigate directly to:
http://localhost:3000/trips/{tripId}/collaborate
```

### **Step 3: Invite Team Members**
1. Enter email address
2. Select role (Viewer/Editor/Admin)
3. Click "Invite"
4. Collaborator receives invitation

### **Step 4: Start Collaborating**
1. Add comments and discussions
2. Track changes made by team members
3. Manage permissions as needed

## 🔧 **Technical Requirements**

### **Database Tables Used**
- `TripCollaborators` - Stores collaboration invitations and roles
- `TripComments` - Stores discussion comments
- `Users` - User information for collaborators
- `Trips` - Trip data being collaborated on

### **Authentication Required**
- User must be logged in
- Must have access to the trip (owner or invited collaborator)
- JWT token required for API calls

## 🎯 **Example Usage**

### **Invite a Collaborator**
```javascript
// Frontend API call
await apiService.request(`/trips/${tripId}/collaborators`, {
  method: 'POST',
  body: JSON.stringify({ 
    email: 'friend@example.com', 
    role: 'editor' 
  })
});
```

### **Add a Comment**
```javascript
// Frontend API call
await apiService.request(`/trips/${tripId}/comments`, {
  method: 'POST',
  body: JSON.stringify({ 
    content: 'This looks great!' 
  })
});
```

## 🎉 **Success!**

You now have full access to GlobeTrotter's collaboration features! Team members can work together to plan the perfect trip with real-time collaboration, role-based permissions, and discussion capabilities.

---

**Need Help?** Check the browser console for any API errors or contact support.