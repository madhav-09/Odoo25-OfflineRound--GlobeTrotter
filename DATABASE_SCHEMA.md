# GlobeTrotter Database Schema

## Overview
Complete PostgreSQL database schema for the GlobeTrotter travel planning application with proper relationships, constraints, and indexes.

## Tables

### 1. Users
Primary user information and authentication data.

```sql
Users {
  id: UUID (PK)
  cognitoId: STRING (UNIQUE, NOT NULL)
  email: STRING (UNIQUE, NOT NULL)
  firstName: STRING (NOT NULL)
  lastName: STRING (NOT NULL)
  profilePicture: STRING
  bio: TEXT
  preferences: JSON
  role: ENUM('user', 'admin')
  isActive: BOOLEAN
  lastLoginAt: DATE
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 2. Trips
Main trip information and metadata.

```sql
Trips {
  id: UUID (PK)
  name: STRING (NOT NULL)
  description: TEXT
  startDate: DATE (NOT NULL)
  endDate: DATE (NOT NULL)
  totalBudget: DECIMAL(10,2)
  actualCost: DECIMAL(10,2)
  currency: STRING(3)
  status: ENUM('planning', 'confirmed', 'ongoing', 'completed', 'cancelled')
  userId: UUID (FK -> Users.id)
  shareToken: STRING (UNIQUE)
  isPublic: BOOLEAN
  customBudgets: JSON
  tags: JSON
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 3. Cities
Cities within trips with travel dates.

```sql
Cities {
  id: UUID (PK)
  name: STRING (NOT NULL)
  country: STRING (NOT NULL)
  state: STRING
  latitude: DECIMAL(10,8)
  longitude: DECIMAL(11,8)
  order: INTEGER
  tripId: UUID (FK -> Trips.id)
  arrivalDate: DATE
  departureDate: DATE
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 4. Activities
Individual activities within cities.

```sql
Activities {
  id: UUID (PK)
  name: STRING (NOT NULL)
  description: TEXT
  category: ENUM('sightseeing', 'food', 'entertainment', 'shopping', 'transport', 'accommodation', 'other')
  cost: DECIMAL(10,2)
  date: DATE (NOT NULL)
  time: TIME
  order: INTEGER (NOT NULL)
  cityId: UUID (FK -> Cities.id)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 5. SharedTrips
Public trip sharing mechanism.

```sql
SharedTrips {
  id: UUID (PK)
  shareToken: STRING (UNIQUE, NOT NULL)
  isPublic: BOOLEAN
  views: INTEGER
  expiresAt: DATE
  tripId: UUID (FK -> Trips.id)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 6. TripCollaborators
Trip collaboration and sharing with users.

```sql
TripCollaborators {
  id: UUID (PK)
  tripId: UUID (FK -> Trips.id)
  userId: UUID (FK -> Users.id)
  role: ENUM('viewer', 'editor', 'admin')
  invitedBy: UUID (FK -> Users.id)
  status: ENUM('pending', 'accepted', 'declined')
  invitedAt: DATE
  respondedAt: DATE
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 7. BudgetItems
Detailed budget tracking and expense management.

```sql
BudgetItems {
  id: UUID (PK)
  tripId: UUID (FK -> Trips.id)
  name: STRING (NOT NULL)
  description: TEXT
  category: ENUM('accommodation', 'transport', 'food', 'activities', 'shopping', 'other')
  budgetedAmount: DECIMAL(10,2) (NOT NULL)
  actualAmount: DECIMAL(10,2)
  currency: STRING(3)
  date: DATE
  isPaid: BOOLEAN
  notes: TEXT
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### 8. TripComments
Collaboration comments and discussions.

```sql
TripComments {
  id: UUID (PK)
  tripId: UUID (FK -> Trips.id)
  userId: UUID (FK -> Users.id)
  content: TEXT (NOT NULL)
  parentId: UUID (FK -> TripComments.id)
  isEdited: BOOLEAN
  editedAt: DATE
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

## Relationships

### One-to-Many
- Users → Trips (1:N)
- Trips → Cities (1:N)
- Cities → Activities (1:N)
- Trips → BudgetItems (1:N)
- Trips → TripComments (1:N)
- Users → TripComments (1:N)
- Trips → TripCollaborators (1:N)
- Users → TripCollaborators (1:N)

### One-to-One
- Trips → SharedTrips (1:1)

### Self-Referencing
- TripComments → TripComments (parent/replies)

## Indexes

### Performance Indexes
```sql
-- Users
CREATE INDEX idx_users_cognito_id ON Users(cognitoId);
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);

-- Trips
CREATE INDEX idx_trips_user_id ON Trips(userId);
CREATE INDEX idx_trips_start_date ON Trips(startDate);
CREATE INDEX idx_trips_status ON Trips(status);
CREATE INDEX idx_trips_share_token ON Trips(shareToken);
CREATE INDEX idx_trips_is_public ON Trips(isPublic);

-- Cities
CREATE INDEX idx_cities_trip_id ON Cities(tripId);
CREATE INDEX idx_cities_name_country ON Cities(name, country);
CREATE INDEX idx_cities_order ON Cities(order);

-- Activities
CREATE INDEX idx_activities_city_id ON Activities(cityId);
CREATE INDEX idx_activities_date ON Activities(date);
CREATE INDEX idx_activities_category ON Activities(category);

-- TripCollaborators
CREATE INDEX idx_collaborators_trip_id ON TripCollaborators(tripId);
CREATE INDEX idx_collaborators_user_id ON TripCollaborators(userId);
CREATE INDEX idx_collaborators_status ON TripCollaborators(status);
CREATE UNIQUE INDEX idx_collaborators_trip_user ON TripCollaborators(tripId, userId);

-- BudgetItems
CREATE INDEX idx_budget_items_trip_id ON BudgetItems(tripId);
CREATE INDEX idx_budget_items_category ON BudgetItems(category);
CREATE INDEX idx_budget_items_date ON BudgetItems(date);

-- TripComments
CREATE INDEX idx_comments_trip_id ON TripComments(tripId);
CREATE INDEX idx_comments_user_id ON TripComments(userId);
CREATE INDEX idx_comments_parent_id ON TripComments(parentId);
CREATE INDEX idx_comments_created_at ON TripComments(createdAt);
```

## Constraints

### Foreign Key Constraints
- All foreign keys have CASCADE DELETE for data integrity
- Proper referential integrity maintained across all relationships

### Data Validation
- Email validation on Users table
- Enum constraints for status fields
- NOT NULL constraints on required fields
- Unique constraints on critical fields (email, shareToken, etc.)

## API Endpoints

### Enhanced Endpoints
```
# Budget Management
POST   /api/trips/:tripId/budget
GET    /api/trips/:tripId/budget
PUT    /api/budget/:budgetItemId
DELETE /api/budget/:budgetItemId

# Collaboration
POST   /api/trips/:tripId/collaborators
GET    /api/trips/:tripId/collaborators
POST   /api/trips/:tripId/comments
GET    /api/trips/:tripId/comments
```

## Database Synchronization

### Commands
```bash
# Sync database schema (preserves data)
npm run db:sync

# Development server with auto-sync
npm run dev
```

### Features
- ✅ Automatic schema synchronization
- ✅ Data preservation during updates
- ✅ Proper foreign key constraints
- ✅ Performance indexes
- ✅ Data validation
- ✅ Cascade deletes for data integrity

## Production Considerations

1. **Backup Strategy**: Regular automated backups
2. **Connection Pooling**: Configured for optimal performance
3. **SSL/TLS**: Enabled for secure connections
4. **Monitoring**: Query performance and connection health
5. **Scaling**: Read replicas for high-traffic scenarios