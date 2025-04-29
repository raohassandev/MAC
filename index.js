// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3333;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/macsys', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // API routes
// app.get('/api/getDevices', (req, res) => {
//   // Temporary mock data
//   const devices = [
//     {
//       _id: '1',
//       name: 'Server Room Cooler',
//       ip: '192.168.1.100',
//       port: 502,
//       slaveId: 1,
//       enabled: true,
//       registers: [
//         {
//           name: 'Temperature',
//           address: 0,
//           length: 2,
//           unit: '°C',
//         },
//       ],
//     },
//     {
//       _id: '2',
//       name: 'Office AC',
//       ip: '192.168.1.101',
//       port: 502,
//       slaveId: 2,
//       enabled: false,
//       registers: [
//         {
//           name: 'Humidity',
//           address: 2,
//           length: 2,
//           unit: '%',
//         },
//       ],
//     },
//   ];

//   res.json(devices);
// });

// // Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

// // Start server
// app.listen(PORT, () => {
//   console.log(`MacSys Backend running on port ${PORT}`);
// });

// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const routes = require('./routes');
const { User } = require('./models');

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

// Initialize admin user if none exists
const initAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('Creating default admin user...');
      await User.create({
        name: 'Admin User',
        email: 'admin@macsys.com',
        password: 'admin123', // Will be hashed by the model pre-save hook
        role: 'admin',
        permissions: [
          'manage_devices',
          'manage_profiles',
          'manage_users',
          'view_analytics',
          'view_devices',
          'view_profiles'
        ]
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// API routes
app.use('/api', routes);

// Mock data for backward compatibility
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

// Initialize admin user
mongoose.connection.once('open', () => {
  initAdminUser();
});

// Start server
app.listen(PORT, () => {
  console.log(`MacSys Backend running on port ${PORT}`);
});