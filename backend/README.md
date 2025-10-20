# CareerConnect Backend API

Node.js + Express + MongoDB backend for the CareerConnect platform.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careerconnect
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Jobs
- `GET /api/jobs` - Get all jobs (with optional filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (recruiter/admin only)
- `PUT /api/jobs/:id` - Update job (recruiter/admin only)
- `DELETE /api/jobs/:id` - Delete job (recruiter/admin only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Submit job application (student only)
- `GET /api/applications/my-applications` - Get user's applications (student only)
- `GET /api/applications/job/:jobId` - Get applications for a job (recruiter/admin only)
- `PUT /api/applications/:id/status` - Update application status (recruiter/admin only)
- `GET /api/applications/:id` - Get application by ID

### Profile
- `GET /api/profile/me` - Get current user's profile
- `PUT /api/profile/me` - Update current user's profile
- `GET /api/profile/:userId` - Get profile by user ID

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Database Schema

### User Model
- email (String, unique, required)
- password (String, required, hashed)
- fullName (String, required)
- role (String: student/recruiter/admin)
- phone (String)
- isActive (Boolean)
- timestamps

### Profile Model
- userId (ObjectId, ref: User)
- bio (String)
- skills (Array of Strings)
- education (Array of Objects)
- experience (Array of Objects)
- resume, portfolio, linkedin, github (Strings)
- timestamps

### Job Model
- title, company, location, description (String, required)
- type (String: full-time/part-time/internship/contract)
- requirements, skills (Array of Strings)
- salary (Object: min, max, currency)
- recruiterId (ObjectId, ref: User)
- status (String: active/closed/draft)
- applicationDeadline (Date)
- timestamps

### Application Model
- jobId (ObjectId, ref: Job)
- studentId (ObjectId, ref: User)
- coverLetter, resume (String)
- status (String: pending/reviewing/shortlisted/rejected/accepted)
- timestamps

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `careerconnect`

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env file

Example connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerconnect?retryWrites=true&w=majority
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security

- Passwords are hashed using bcryptjs
- JWT tokens expire after 30 days
- Protected routes require valid JWT token
- Role-based access control for admin and recruiter routes
