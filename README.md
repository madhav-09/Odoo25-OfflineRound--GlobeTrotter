# 🌍 GlobeTrotter - Travel Planning Application

> **Odoo 25 Offline Round Submission** - A comprehensive travel planning platform with modern UI/UX

A feature-rich travel planning application built with React.js and Node.js, featuring a stunning dark-mode interface with purple-violet theme and glass morphism effects.

Video Link : - https://youtu.be/d3P7FyIWLZE

| 👥 Team Members    | Email                                                           |
| ------------------ | --------------------------------------------------------------- |
| Madhav Tiwari      | [tiwarimadhav2309@gmail.com](mailto:tiwarimadhav2309@gmail.com) |
| Rahul Patel        | [onlinerahulpatel@gmail.com](mailto:onlinerahulpatel@gmail.com) |
| Oad Harsh Kanubhai | [harshoad7205@gmail.com](mailto:harshoad7205@gmail.com)         |


## ✨ Key Features

### 🔐 Authentication & User Management
- **AWS Cognito Integration** with custom UI
- **User Profiles** with image upload and social features
- **Role-based Access Control** (Admin/User)

### 🗺️ Trip Planning & Management
- **Interactive Trip Builder** with drag-and-drop itinerary
- **Budget Tracking** with expense categorization
- **Calendar Integration** with timeline view
- **Collaborative Planning** with real-time sharing

### 🌟 Social & Discovery Features
- **Public Itinerary Explorer** (Landing page for non-authenticated users)
- **Travel Stories** with community sharing
- **City Discovery** with comprehensive data (currency, population, weather)
- **Social Sharing** with QR codes and multiple platforms

### 🎨 Modern UI/UX

![WhatsApp Image 2025-08-12 at 10 20 48_f4449682](https://github.com/user-attachments/assets/0378d29d-6fcf-4fa3-ba99-83eba51969c0)
![WhatsApp Image 2025-08-12 at 10 20 49_fbde027f](https://github.com/user-attachments/assets/f91485bd-a3fc-4312-a067-ccbf688c75a5)
![WhatsApp Image 2025-08-12 at 10 25 01_dc4b18bc](https://github.com/user-attachments/assets/b9c565f5-d2b8-435a-ac64-0566f1334d28)
![WhatsApp Image 2025-08-12 at 10 35 46_01a820f1](https://github.com/user-attachments/assets/1bf7a258-43e8-4b61-beef-9fc9b280f469)
![WhatsApp Image 2025-08-12 at 10 37 36_446f0ab2](https://github.com/user-attachments/assets/8c5d1852-3a1b-41c2-9276-9ddf1c3256f1)
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ee084256-9db8-4404-9b2f-7420ae921f13" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e76b7e01-1a17-4400-9814-f99c164de0ba" />


- **Dark Mode by Default** with light mode toggle
- **Glass Morphism Effects** with smooth animations
- **Responsive Design** across all devices
- **Inter Font** (Google Sans alternative) throughout
- **Scroll-to-top** functionality with royal violet styling

## 🚀 Technology Stack

### Frontend Technologies
- **React.js 18** - Modern component-based architecture
- **React Router DOM** - Client-side routing
- **React Icons** - Consistent iconography
- **CSS Variables** - Dynamic theming system
- **AWS Cognito SDK** - Authentication integration

### Backend Technologies
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **PostgreSQL (AWS RDS)** - Production database
- **Sequelize ORM** - Database modeling and queries
- **JWT Authentication** - Secure token-based auth
- **Multer** - File upload handling

### Infrastructure & Deployment
- **AWS RDS PostgreSQL** - Managed database service
- **AWS Cognito** - User authentication and management
- **Environment-based Configuration** - Development/Production setups

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- AWS Account (for Cognito and RDS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/madhav-09/Odoo25-OfflineRound--GlobeTrotter.git
   cd Odoo25-OfflineRound--GlobeTrotter
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Backend Environment** (`.env` in backend folder)
   ```env
   PORT=5001
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=your-rds-endpoint.amazonaws.com
   DB_PORT=5432
   DB_NAME=globetrotter
   DB_USER=your-username
   DB_PASSWORD=your-password
   
   # AWS Cognito
   AWS_REGION=your-region
   COGNITO_USER_POOL_ID=your-pool-id
   COGNITO_CLIENT_ID=your-client-id
   
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Frontend Environment** (`.env` in frontend folder)
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_AWS_REGION=your-region
   REACT_APP_COGNITO_USER_POOL_ID=your-pool-id
   REACT_APP_COGNITO_CLIENT_ID=your-client-id
   ```

### Running the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm start
```

**Application URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Database Setup

```bash
# Initialize database (from backend directory)
node migrations/sync-database.js

# Seed sample data
node scripts/seed-stories.js
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple Violet (#8b5cf6, #a78bfa)
- **Accent**: Royal Violet (#663399)
- **Background**: Dark gradient (#0f0f23 to #1a1a2e)
- **Glass Effects**: Translucent overlays with backdrop blur

### Typography
- **Font Family**: Inter (Google Sans alternative)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive**: Fluid typography scaling

### UI Principles
- **Glass Morphism**: Translucent cards with blur effects
- **Dark Mode First**: Optimized for dark theme
- **Smooth Animations**: 0.3s cubic-bezier transitions
- **Mobile-First**: Responsive design approach

## 📱 Feature Highlights

### 🎯 Core Functionality
- ✅ **Complete Authentication System** - AWS Cognito integration
- ✅ **Trip Management** - Full CRUD with collaborative features
- ✅ **Budget Tracking** - Expense categorization and analytics
- ✅ **Interactive Calendar** - Timeline view with drag-and-drop
- ✅ **Social Features** - Stories, sharing, and community
- ✅ **Public Explorer** - Landing page for non-authenticated users

### 🌟 Advanced Features
- ✅ **Real-time Collaboration** - Multi-user trip planning
- ✅ **QR Code Sharing** - Easy trip sharing via QR codes
- ✅ **City Database** - 30+ cities with comprehensive data
- ✅ **Travel Stories** - Community-driven content
- ✅ **Admin Dashboard** - User and content management
- ✅ **Responsive Design** - Optimized for all screen sizes

### 🎨 UI/UX Excellence
- ✅ **Dark Mode Default** - Modern dark interface
- ✅ **Glass Morphism** - Beautiful translucent effects
- ✅ **Smooth Animations** - Polished user interactions
- ✅ **Scroll-to-top** - Enhanced navigation experience

## 📊 Project Structure

```
GlobeTrotter/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Sequelize database models
│   ├── routes/            # API route definitions
│   ├── scripts/           # Database utilities
│   └── server.js          # Main server file
├── frontend/               # React.js application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── context/       # React context providers
│   │   └── services/      # API service functions
└── documentation/          # Project documentation
```

## 🎯 Odoo 25 Offline Round Submission

This project demonstrates:
- **Full-Stack Development** - Complete MERN-like stack
- **Modern UI/UX** - Contemporary design principles
- **Scalable Architecture** - Production-ready structure
- **Database Design** - Comprehensive relational schema
- **Authentication & Security** - AWS Cognito integration
- **Responsive Design** - Mobile-first approach
- **Performance Optimization** - Efficient rendering and caching

## 🚀 Deployment

Refer to `PRODUCTION_DEPLOYMENT.md` for detailed deployment instructions including:
- AWS RDS setup
- Environment configuration
- Production build process
- Security considerations

## 📞 Contact

**Developer**: Madhav  
**GitHub**: [@madhav-09](https://github.com/madhav-09)  
**Project**: Odoo 25 Offline Round Submission

---

*Built with ❤️ for the Odoo 25 Offline Round*
