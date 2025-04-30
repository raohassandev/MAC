# MacSys Project Reference Document

## Project Overview
MacSys (Modbus Device Management System) is a full-stack application for monitoring and controlling Modbus devices like cooling systems. It features:

- User authentication and role-based access control
- Device management (add, edit, delete, connect to Modbus devices)
- Profile management (create and apply cooling profiles to devices)
- Dashboard for monitoring device status and temperature
- Scheduling capabilities for automated control

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Communication**: Modbus-serial for device interactions

## Project Structure

### Backend (Node.js/Express)
- `/src/controllers/` - API endpoints logic
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

## Key Features

### Authentication System
- Login/Register functionality
- JWT-based authentication
- Role-based access (User, Engineer, Admin)
- Permission-based authorization

### Device Management
- CRUD operations for Modbus devices
- Connection testing
- Register reading and writing
- Real-time monitoring

### Profile Management
- Create cooling profiles with temperature settings
- Assign profiles to multiple devices
- Schedule profile activation
- Templates for reusable profiles

### Dashboard
- Device status overview
- Temperature trends visualization
- Recent alerts display
- Quick access to important devices

## Models

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'user' | 'engineer' | 'admin';
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

## Known Issues and Requirements
- Integration with real Modbus devices needs proper configuration
- Proper error handling for network issues
- UI/UX improvements for the device management interface
- Enhanced reporting and analytics features

## Development Roadmap
- Complete core device and profile management features
- Implement real-time monitoring with WebSockets
- Add advanced scheduling capabilities
- Develop reporting and analytics dashboard
- Implement user management for administrators