import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../server';
import User from '../../models/User';

describe('Authentication E2E Workflow', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/macsys_test_e2e');
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    
    // Close database connection
    await mongoose.connection.close();
  });

  test('Complete authentication workflow', async () => {
    // Step 1: Register a new user
    const userData = {
      name: 'E2E Auth Test User',
      email: 'auth-test@example.com',
      password: 'securepassword',
    };
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('_id');
    expect(registerRes.body).toHaveProperty('name', 'E2E Auth Test User');
    expect(registerRes.body).toHaveProperty('email', 'auth-test@example.com');
    expect(registerRes.body).toHaveProperty('token');
    expect(registerRes.body).not.toHaveProperty('password');
    
    const userId = registerRes.body._id;
    const userToken = registerRes.body.token;
    
    // Step 2: Get current user with token
    const getMeRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(getMeRes.status).toBe(200);
    expect(getMeRes.body).toHaveProperty('_id', userId);
    expect(getMeRes.body).toHaveProperty('name', 'E2E Auth Test User');
    expect(getMeRes.body).toHaveProperty('role', 'user');
    expect(getMeRes.body).not.toHaveProperty('password');
    
    // Step 3: Logout (client-side operation, just testing if token is invalid)
    // In a real app, the token would be invalidated on the server
    // Here we're just testing with no token
    const noTokenRes = await request(app)
      .get('/api/auth/me');
    
    expect(noTokenRes.status).toBe(401);
    expect(noTokenRes.body).toHaveProperty('message');
    
    // Step 4: Login with credentials
    const loginData = {
      email: 'auth-test@example.com',
      password: 'securepassword',
    };
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send(loginData);
    
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('_id', userId);
    expect(loginRes.body).toHaveProperty('token');
    
    const newToken = loginRes.body.token;
    
    // Step 5: Verify new token works
    const verifyRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${newToken}`);
    
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toHaveProperty('_id', userId);
    
    // Step 6: Test login failure with wrong password
    const wrongPassData = {
      email: 'auth-test@example.com',
      password: 'wrongpassword',
    };
    
    const wrongPassRes = await request(app)
      .post('/api/auth/login')
      .send(wrongPassData);
    
    expect(wrongPassRes.status).toBe(401);
    expect(wrongPassRes.body).toHaveProperty('message', 'Invalid credentials');
    
    // Step 7: Test login failure with non-existent email
    const wrongEmailData = {
      email: 'nonexistent@example.com',
      password: 'anypassword',
    };
    
    const wrongEmailRes = await request(app)
      .post('/api/auth/login')
      .send(wrongEmailData);
    
    expect(wrongEmailRes.status).toBe(401);
    expect(wrongEmailRes.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('Role-based access control', async () => {
    // Create admin user
    const adminData = {
      name: 'E2E Admin User',
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'admin',
      permissions: ['manage_devices', 'manage_profiles', 'manage_users'],
    };
    
    const adminUser = await User.create(adminData);
    
    // Create regular user
    const regularData = {
      name: 'E2E Regular User',
      email: 'regular@example.com',
      password: 'regularpass',
      role: 'user',
      permissions: ['view_devices', 'view_profiles'],
    };
    
    const regularUser = await User.create(regularData);
    
    // Login as admin
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass',
      });
    
    expect(adminLoginRes.status).toBe(200);
    const adminToken = adminLoginRes.body.token;
    
    // Login as regular user
    const regularLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'regular@example.com',
        password: 'regularpass',
      });
    
    expect(regularLoginRes.status).toBe(200);
    const regularToken = regularLoginRes.body.token;
    
    // Create a test device with admin token
    const deviceData = {
      name: 'RBAC Test Device',
      ip: '192.168.1.250',
      port: 502,
      slaveId: 10,
      enabled: true,
    };
    
    const createDeviceRes = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(deviceData);
    
    expect(createDeviceRes.status).toBe(201);
    
    // Regular user can view devices
    const viewDeviceRes = await request(app)
      .get('/api/devices')
      .set('Authorization', `Bearer ${regularToken}`);
    
    expect(viewDeviceRes.status).toBe(200);
    
    // Regular user cannot create devices
    const regularCreateRes = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${regularToken}`)
      .send(deviceData);
    
    expect(regularCreateRes.status).toBe(403);
    
    // Admin can access protected routes
    const protectedRouteRes = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(deviceData);
    
    expect(protectedRouteRes.status).toBe(201);
    
    // Test invalid token
    const invalidTokenRes = await request(app)
      .get('/api/devices')
      .set('Authorization', 'Bearer invalidtoken');
    
    expect(invalidTokenRes.status).toBe(401);
  });
});