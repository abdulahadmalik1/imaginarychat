const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Beta Pin Schema
const betaPinSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BetaPin = mongoose.model('BetaPin', betaPinSchema);

// Initialize default pin if it doesn't exist
const initializeDefaultPin = async () => {
  try {
    const existingPin = await BetaPin.findOne({ pin: process.env.BETA_SECRET_PIN });
    if (!existingPin) {
      const defaultPin = new BetaPin({
        pin: process.env.BETA_SECRET_PIN,
        isActive: true
      });
      await defaultPin.save();
      console.log('Default beta pin initialized');
    }
  } catch (error) {
    console.error('Error initializing default pin:', error);
  }
};

// Routes
app.post('/api/verify-beta-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({ success: false, message: 'Pin is required' });
    }

    const validPin = await BetaPin.findOne({ pin: pin, isActive: true });
    
    if (validPin) {
      res.json({ success: true, message: 'Logged in successfully!' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid pin' });
    }
  } catch (error) {
    console.error('Error verifying pin:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDefaultPin();
});