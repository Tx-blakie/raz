# MERN Stack Application

A full-stack application built with MongoDB, Express.js, React, and Node.js.

## Project Structure

The project is divided into two main parts:

- `backend`: Node.js server with Express and MongoDB
- `frontend`: React application with Vite and Tailwind CSS

## Backend

The backend is built using:

- Node.js and Express.js for the server
- MongoDB with Mongoose for database operations
- User authentication with bcrypt for password hashing

### Setup Backend

```bash
cd backend
npm install
npm run dev
```

The server will start on http://localhost:5000.

## Frontend

The frontend is built using:

- React with Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will start on http://localhost:5173.

## Features

- User registration and authentication
- Responsive design with Tailwind CSS
- RESTful API endpoints
- Form validation

## Development

To run both frontend and backend concurrently, you can install a package like `concurrently` in the root directory and set up scripts to run both servers.

## License

ISC 