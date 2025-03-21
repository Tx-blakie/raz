# Backend API

This is a RESTful API built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/myapp
   NODE_ENV=development
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Register a new user
- `GET /api/users/:id` - Get user by ID

## Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ODM
- bcryptjs - Password hashing
- dotenv - Environment variables
- cors - CORS middleware
- nodemon - Development server 