const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const villaRoutes = require('./routes/villaRoutes');

dotenv.config(); // Load .env variables

const app = express();

// Allow frontend to communicate with backend
app.use(cors({
  origin: 'http://localhost:5500', // or later: your deployed frontend
  credentials: true
}));

// Parse incoming JSON
app.use(express.json());

// Enable session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Set up route files
app.use('/api/auth', authRoutes);
app.use('/api/villas', villaRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
