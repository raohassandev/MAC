import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../server';
import Device from '../../models/Device';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

describe('Device API Endpoints', () => {
  let token: string;
  let adminUser: any;
  const testDevices = [
    {
      name: 'Test Device 1',
      ip: '192.168.1.100',
      port: 502,
      slaveId: 1,
      enabled: true,
      registers: [
        {
          name: 'Temperature',
          address: 100,
          length: 2,
          scaleFactor: 10,
          unit: '°C',
        },
      ],
    },
    {
      name: 'Test Device 2',
      ip: '192.168.1.101',
      port: 502,
      slaveId: 2,
      enabled: false,
    },
  ];
  let deviceIds: string[] = [];

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/macsys_test');
    
    // Create a test admin user
    adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      permissions: [
        'manage_devices',
        'manage_profiles',
        'manage_users',
        'view_analytics',
        'view_devices',
        'view_profiles',
      ],
    });
    
    // Generate a valid JWT for the admin user
    token = jwt.sign(
      { id: adminUser._id },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );
    
    // Create test devices
    const devices = await Device.insertMany(testDevices);
    deviceIds = devices.map(d => d._id.toString());
  });

  afterAll(async () => {
    // Clean up test data
    await Device.deleteMany({});
    await User.deleteMany({});
    
    // Close database connection
    await mongoose.connection.close();
  });

  describe('GET /api/devices', () => {
    test('should return all devices', async () => {
      const res = await request(app)
        .get('/api/devices')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('ip');
      expect(res.body[0]).toHaveProperty('enabled');
    });

    test('should require authentication', async () => {
      const res = await request(app).get('/api/devices');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/devices/:id', () => {
    test('should return a single device by ID', async () => {
      const res = await request(app)
        .get(`/api/devices/${deviceIds[0]}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', deviceIds[0]);
      expect(res.body).toHaveProperty('name', 'Test Device 1');
      expect(res.body).toHaveProperty('ip', '192.168.1.100');
      expect(res.body.registers).toHaveLength(1);
      expect(res.body.registers[0]).toHaveProperty('name', 'Temperature');
    });

    test('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/devices/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Device not found');
    });
  });

  describe('POST /api/devices', () => {
    test('should create a new device', async () => {
      const newDevice = {
        name: 'Test Device 3',
        ip: '192.168.1.102',
        port: 502,
        slaveId: 3,
        enabled: true,
      };
      
      const res = await request(app)
        .post('/api/devices')
        .set('Authorization', `Bearer ${token}`)
        .send(newDevice);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'Test Device 3');
      expect(res.body).toHaveProperty('ip', '192.168.1.102');
      
      // Store the new device ID for cleanup
      deviceIds.push(res.body._id);
    });

    test('should validate required fields', async () => {
      const invalidDevice = {
        // Missing required 'name' field
        ip: '192.168.1.103',
        port: 502,
      };
      
      const res = await request(app)
        .post('/api/devices')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidDevice);
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('validation failed');
    });
  });

  describe('PUT /api/devices/:id', () => {
    test('should update an existing device', async () => {
      const updatedData = {
        name: 'Updated Device 1',
        enabled: false,
      };
      
      const res = await request(app)
        .put(`/api/devices/${deviceIds[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Device 1');
      expect(res.body).toHaveProperty('enabled', false);
      expect(res.body).toHaveProperty('ip', '192.168.1.100'); // Original field should be preserved
    });

    test('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .put(`/api/devices/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Does not exist' });
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Device not found');
    });
  });

  describe('DELETE /api/devices/:id', () => {
    test('should delete an existing device', async () => {
      const res = await request(app)
        .delete(`/api/devices/${deviceIds[1]}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Device removed');
      expect(res.body).toHaveProperty('id', deviceIds[1]);
      
      // Verify device was deleted
      const checkDevice = await Device.findById(deviceIds[1]);
      expect(checkDevice).toBeNull();
    });

    test('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .delete(`/api/devices/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Device not found');
    });
  });

  describe('POST /api/devices/:id/test', () => {
    test('should test connection to device', async () => {
      const res = await request(app)
        .post(`/api/devices/${deviceIds[0]}/test`)
        .set('Authorization', `Bearer ${token}`);
      
      // Since actual Modbus connection won't work in tests,
      // we check for either success or the expected error message
      expect(res.status).toBe(200).or.toBe(400);
      
      if (res.status === 200) {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message');
      } else {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Connection failed');
      }
    });

    test('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .post(`/api/devices/${fakeId}/test`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Device not found');
    });
  });

  describe('GET /api/devices/:id/read', () => {
    test('should attempt to read device registers', async () => {
      const res = await request(app)
        .get(`/api/devices/${deviceIds[0]}/read`)
        .set('Authorization', `Bearer ${token}`);
      
      // Since actual Modbus reading won't work in tests,
      // we check for either success or the expected error message
      expect(res.status).toBe(200).or.toBe(400);
      
      if (res.status === 200) {
        expect(res.body).toHaveProperty('deviceId');
        expect(res.body).toHaveProperty('deviceName');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('readings');
        expect(Array.isArray(res.body.readings)).toBe(true);
      } else {
        expect(res.body).toHaveProperty('message');
      }
    });

    test('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/devices/${fakeId}/read`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Device not found');
    });
  });
});