const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/macsys', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.get('/api/getDevices', (req, res) => {
  // Temporary mock data
  const devices = [
    {
      _id: '1',
      name: 'Server Room Cooler',
      ip: '192.168.1.100',
      port: 502,
      slaveId: 1,
      enabled: true,
      registers: [
        {
          name: 'Temperature',
          address: 0,
          length: 2,
          unit: '°C',
        },
      ],
    },
    {
      _id: '2',
      name: 'Office AC',
      ip: '192.168.1.101',
      port: 502,
      slaveId: 2,
      enabled: false,
      registers: [
        {
          name: 'Humidity',
          address: 2,
          length: 2,
          unit: '%',
        },
      ],
    },
  ];

  res.json(devices);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`MacSys Backend running on port ${PORT}`);
});