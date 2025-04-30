# MacSys Project Reference Document

## Project Overview
MacSys (Modbus Device Management System) is a full-stack application for monitoring and controlling Modbus devices like cooling systems. The system is currently functional with the following core features:

- User authentication with JWT-based authorization
- Role-based access control system (Admin, Engineer, Operator, Viewer)
- Device management interface (viewing, adding, editing, deleting devices)
- Profile management for temperature control settings
- Dashboard with system monitoring metrics
- System monitoring tools

## Current State of Implementation
Most of the core functionality is working, with several key components successfully implemented:

- **Authentication System**: Login/Register functionality with JWT tokens
- **Dashboard**: Real-time system metrics, temperature trends, and device status display
- **Device Management**: Basic CRUD operations for devices with Modbus communication
- **Profile Management**: Create and manage cooling profiles with settings
- **UI Components**: Core UI components following a consistent design system

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, React Router v6
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Communication**: Modbus-serial library for device interactions

## Project Structure

### Backend (Node.js/Express)
- `/src/controllers/` - API endpoint logic
- `/src/models/` - MongoDB schema definitions
- `/src/routes/` - API route definitions
- `/src/middleware/` - Auth and validation middleware
- `/src/index.ts` - Main entry point

### Frontend (React)
- `/client/src/components/` - Reusable UI components
- `/client/src/contexts/` - React context providers (auth, devices, etc.)
- `/client/src/hooks/` - Custom React hooks
- `/client/src/pages/` - Main application pages
- `/client/src/services/` - API service functions
- `/client/src/types/` - TypeScript type definitions

## Currently Working Features

### Authentication System
- ✅ Login/Register functionality
- ✅ JWT-based authentication
- ✅ Role-based access (Admin, Engineer, Operator, Viewer)
- ✅ Permission-based authorization

### Device Management
- ✅ View list of devices with status indicators
- ✅ Add new devices with connection details
- ✅ Edit existing devices
- ✅ Delete devices
- ✅ Basic connection testing
- ✅ Device details view
- ✅ Device register configuration

### Profile Management
- ✅ View list of cooling profiles
- ✅ Create new profiles with temperature settings
- ✅ Edit existing profiles
- ✅ Apply profiles to devices
- ✅ Profile templates support

### Dashboard
- ✅ System status overview
- ✅ Temperature trends visualization
- ✅ Device status charts
- ✅ Quick action panels
- ✅ System alerts display

### System Monitor
- ✅ CPU, memory, disk usage visualization
- ✅ Temperature monitoring
- ✅ System uptime tracking
- ✅ Performance metrics over time

## Models

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'engineer' | 'operator' | 'viewer';
  permissions: string[];
}
```

### Device
```typescript
{
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  registers: {
    name: string;
    address: number;
    length: number;
    scaleFactor?: number;
    decimalPoint?: number;
    byteOrder?: string;
    unit?: string;
  }[];
  lastSeen?: Date;
  connectionType?: 'tcp' | 'rtu';
  tags: string[];
  make?: string;
  model?: string;
  description?: string;
}
```

### Profile
```typescript
{
  name: string;
  description?: string;
  targetTemperature: number;
  temperatureRange: [number, number];
  fanSpeed: number;
  mode: 'cooling' | 'heating' | 'auto' | 'dehumidify';
  schedule: {
    active: boolean;
    times: {
      days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
      startTime: string;
      endTime: string;
    }[];
  };
  assignedDevices: string[];
  isTemplate: boolean;
  tags: string[];
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user

### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get a single device
- `POST /api/devices` - Create a new device
- `PUT /api/devices/:id` - Update a device
- `DELETE /api/devices/:id` - Delete a device
- `POST /api/devices/:id/test` - Test connection to a device
- `GET /api/devices/:id/read` - Read registers from a device

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get a single profile
- `POST /api/profiles` - Create a new profile
- `PUT /api/profiles/:id` - Update a profile
- `DELETE /api/profiles/:id` - Delete a profile
- `POST /api/profiles/:id/duplicate` - Duplicate a profile
- `POST /api/profiles/:id/apply` - Apply profile to assigned devices
- `GET /api/profiles/templates` - Get all template profiles
- `POST /api/profiles/from-template/:templateId` - Create a profile from template

## Areas for Improvement

### Backend Enhancements
1. **Real Device Integration**: Improve the Modbus communication to handle more device types
2. **Error Handling**: Enhance error handling and logging for device communication
3. **Data Validation**: Add more robust validation for incoming data
4. **API Documentation**: Create comprehensive API documentation with Swagger

### Frontend Enhancements
1. **Mobile Responsiveness**: Improve the mobile experience for field engineers
2. **User Management Interface**: Complete the admin user management functionality
3. **Device Groups**: Add the ability to group devices by location or purpose
4. **Advanced Filtering**: Enhance the filtering and search capabilities for devices and profiles
5. **Data Visualization**: Add more sophisticated charts and graphs for monitoring data

### Security Enhancements
1. **Two-Factor Authentication**: Implement 2FA for enhanced security
2. **API Rate Limiting**: Add rate limiting to prevent abuse
3. **Password Policies**: Enforce stronger password requirements
4. **Session Management**: Implement session timeouts and active session tracking

### Performance Optimizations
1. **Data Caching**: Implement caching for frequently accessed data
2. **Batch Operations**: Support bulk device operations for efficiency
3. **Optimize Database Queries**: Add indexing and query optimization

## Setup Instructions

1. Clone the repository
2. Install root dependencies: `npm install`
3. Install client dependencies: `cd client && npm install`
4. Set up MongoDB (local or remote)
5. Create `.env` file based on `.env.example`
6. Run backend: `npm run server`
7. Run frontend: `npm run client`
8. Or run both: `npm start`

## Default Admin User
- Email: admin@macsys.com
- Password: admin123

## Environment Variables

### Backend (.env)
```
# Server Configuration
PORT=3333

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/macsys

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here

# Other Configuration
NODE_ENV=development
```

### Frontend (client/.env.development, client/.env.production)
```
# Development
VITE_API_URL=http://localhost:3333

# Production
VITE_API_URL=/api
```

## Next Steps
1. Complete the Admin panel with user management capabilities
2. Enhance device register configuration with more templates
3. Implement real-time updates with WebSockets
4. Add advanced scheduling features
5. Improve mobile responsiveness
6. Add automated device discovery for common Modbus devices
7. Implement device grouping functionality
8. Add comprehensive documentation and help system
9. Create backup and restore functionality