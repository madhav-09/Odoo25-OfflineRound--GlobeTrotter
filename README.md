# GlobeTrotter - Travel Planning Application

A modern, intuitive travel planning application built with React.js and Node.js, featuring a sleek purple-violet theme with glass morphism effects.

## 🌟 Features

- **User Authentication**: AWS Cognito integration with custom UI
- **Trip Management**: Create, view, edit, and delete travel itineraries
- **Interactive Dashboard**: Quick actions and travel statistics
- **Destination Discovery**: Explore popular destinations with search and filters
- **Responsive Design**: Fully responsive across all devices
- **Modern UI**: Glass morphism effects with smooth animations
- **Dark/Light Mode**: Theme switcher with system preference detection

## 🚀 Tech Stack

### Frontend
- React.js 18
- React Router DOM
- React Icons
- Pure CSS with CSS Variables
- AWS Cognito SDK

### Backend
- Node.js
- Express.js
- PostgreSQL (AWS RDS)
- Sequelize ORM
- AWS Cognito
- JWT Authentication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd globetrotter
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Setup Environment Variables**

   **Backend (.env)**
   ```env
   PORT=5001
   NODE_ENV=development
   
   # Database
   DB_HOST=your-rds-endpoint.amazonaws.com
   DB_PORT=5432
   DB_NAME=globetrotter
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   
   # AWS Cognito
   AWS_REGION=your-region
   COGNITO_USER_POOL_ID=your-user-pool-id
   COGNITO_CLIENT_ID=your-client-id
   
   # JWT
   JWT_SECRET=your-jwt-secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_AWS_REGION=your-region
   REACT_APP_COGNITO_USER_POOL_ID=your-user-pool-id
   REACT_APP_COGNITO_CLIENT_ID=your-client-id
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory)
npm start
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build
```

## 🎨 Design System

- **Primary Colors**: Purple Violet (#8b5cf6, #a78bfa)
- **Typography**: Inter (Google Fonts)
- **Effects**: Glass morphism with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first approach

## 📱 Features Overview

### ✅ Completed
- User authentication (login/signup/verification)
- Responsive navigation with mobile menu
- Dashboard with quick actions
- Trip CRUD operations
- Destination exploration
- Modern UI with animations

### 🚧 In Progress
- Itinerary builder
- Budget tracking
- Trip sharing
- Advanced search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔧 Development Notes

- Uses AWS RDS PostgreSQL for database
- Implements JWT authentication with AWS Cognito
- Responsive design with CSS Grid and Flexbox
- Glass morphism effects with CSS backdrop-filter
- React Icons for consistent iconography

## 📞 Support

For support and questions, please open an issue in the repository.