require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow local development
        if (origin.startsWith('http://localhost:')) {
            return callback(null, true);
        }
        // Allow Vercel deployments
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        // Allow Render deployments
        if (origin.endsWith('.onrender.com')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true, // Allow cookies to be sent along with the request
}));
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
    res.send('Car Dealership API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
