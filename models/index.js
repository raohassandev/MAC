// models/Device.js
const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: Number, required: true },
  length: { type: Number, default: 2 },
  scaleFactor: { type: Number, default: 1 },
  decimalPoint: { type: Number, default: 0 },
  byteOrder: { type: String, default: 'AB CD' },
  unit: { type: String },
});

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  port: { type: Number, default: 502 },
  slaveId: { type: Number, required: true, default: 1 },
  enabled: { type: Boolean, default: true },
  registers: [RegisterSchema],
  lastSeen: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt timestamp on save
DeviceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Device', DeviceSchema);

// models/Profile.js
const mongoose = require('mongoose');

const ScheduleTimeSchema = new mongoose.Schema({
  days: [
    { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
  ],
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const ScheduleSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  times: [ScheduleTimeSchema],
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  targetTemperature: { type: Number, required: true },
  temperatureRange: {
    type: [Number],
    required: true,
    validate: [
      (val) => val.length === 2,
      'Temperature range must have exactly 2 values',
    ],
  },
  fanSpeed: { type: Number, required: true, min: 0, max: 100 },
  mode: {
    type: String,
    enum: ['cooling', 'heating', 'auto', 'dehumidify'],
    default: 'cooling',
  },
  schedule: {
    type: ScheduleSchema,
    default: () => ({ active: false, times: [] }),
  },
  assignedDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  isTemplate: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt timestamp on save
ProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'engineer', 'admin'], default: 'user' },
  permissions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  this.updatedAt = Date.now();

  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

// models/Alert.js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  deviceName: { type: String, required: true },
  message: { type: String, required: true },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error'],
    default: 'info',
  },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model('Alert', AlertSchema);

// models/index.js
// Export all models
module.exports = {
  Device: require('./Device'),
  Profile: require('./Profile'),
  User: require('./User'),
  Alert: require('./Alert'),
};
