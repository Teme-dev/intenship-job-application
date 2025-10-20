# CareerConnect - Job Portal Platform

A full-stack job portal platform connecting students with recruiters, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication with role-based access (Student, Recruiter, Admin)
- Job posting and management for recruiters
- Job search and application for students
- Profile management
- Application tracking
- Admin dashboard for user management

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- Vite as build tool

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
careerconnect/
├── backend/              # Backend API
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── src/                 # Frontend source
│   ├── components/      # React components
│   ├── context/         # React context
│   ├── pages/          # Page components
│   ├── routes/         # Route configuration
│   ├── utils/          # Utility functions
│   └── main.jsx        # Entry point
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careerconnect
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to project root directory

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## User Roles

### Student
- Browse and search jobs
- Apply for jobs
- Manage profile and resume
- Track application status

### Recruiter
- Post job listings
- Manage job postings
- Review applications
- Update application status

### Admin
- Manage all users
- View system statistics
- Moderate content

## API Documentation

See `backend/README.md` for detailed API documentation.

## Building for Production

### Frontend
```bash
npm run build
```

### Backend
```bash
cd backend
npm start
```

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

### Backend (backend/.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## License

MIT
