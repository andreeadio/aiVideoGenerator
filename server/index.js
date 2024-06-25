require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Import routes
const videoRouter = require('./routes/video');
const imageRouter = require('./routes/image');
const authRouter = require('./routes/user');
const { authenticateToken } = require('./middleware/authMiddleware');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));


// Middlewares
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Public Routes
app.use('/api/auth', authRouter);

// Protected Routes
app.use('/api', authenticateToken, videoRouter);
app.use('/api', authenticateToken, imageRouter);

app.use('/output', express.static(path.join(__dirname, 'output')));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

