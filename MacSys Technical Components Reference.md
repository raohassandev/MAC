# MacSys Technical Components Reference

## Core Components

### Supported Modbus Device Types
- **Temperature Controllers**: HVAC and cooling system controllers
- **Energy Analyzers**: Power monitoring devices
- **Programmable Logic Controllers (PLCs)**: Industrial automation devices
- **Variable Frequency Drives (VFDs)**: Motor speed controllers
- **Sensors**: Temperature, humidity, pressure sensors
- **Custom Devices**: User-defined device configurations

### Backend Services

#### 1. Device Communication Service
- **Functionality**: Connects to and communicates with Modbus devices
- **Key Files**: 
  - `src/controllers/deviceController.ts` (communication logic)
  - `src/models/Device.ts` (device schema)
- **Main Methods**:
  - `testDeviceConnection()` - Test connection to a Modbus device
  - `readDeviceRegisters()` - Read register values from a device
  - `writeDeviceRegisters()` - Write values to device registers (to be implemented)
- **Core Technology**: modbus-serial library

#### 2. Authentication Service
- **Functionality**: User authentication and authorization
- **Key Files**:
  - `src/controllers/authController.ts`
  - `src/middleware/authMiddleware.ts`
  - `src/models/User.ts`
- **Main Methods**:
  - `register()` - Register new users
  - `login()` - Authenticate users
  - `getMe()` - Get current user
  - `protect()` middleware - Protect routes
  - `checkPermission()` middleware - Check user permissions

#### 3. Profile Management Service
- **Functionality**: Manage cooling profiles and apply to devices
- **Key Files**:
  - `src/controllers/profileController.ts`
  - `src/models/Profile.ts`
- **Main Methods**:
  - `applyProfile()` - Apply profile settings to assigned devices
  - `createFromTemplate()` - Create a profile from a template
  - `duplicateProfile()` - Duplicate an existing profile

### Frontend Components

#### 1. Device Management Components
- **Functionality**: Add, edit, delete, and view devices
- **Key Files**:
  - `client/src/pages/DeviceManagement.tsx` - Main device list page
  - `client/src/pages/DeviceDetails.tsx` - Single device view
  - `client/src/components/devices/DeviceModal.tsx` - Add/Edit device modal
  - `client/src/components/devices/DeviceForm.tsx` - Device form
  - `client/src/hooks/useDevices.tsx` - Device management hook

#### 2. Profile Management Components
- **Functionality**: Add, edit, delete, and apply profiles
- **Key Files**:
  - `client/src/pages/ProfileManagement.tsx` - Profile management page
  - `client/src/pages/ProfileEditor.tsx` - Profile creation/editing page
  - `client/src/components/profiles/ProfileForm.tsx` - Profile form
  - `client/src/components/profiles/ScheduleEditor.tsx` - Schedule editor component

#### 3. Dashboard Components
- **Functionality**: Show overview of device status and data
- **Key Files**:
  - `client/src/pages/Dashboard.tsx` - Main dashboard page
  - `client/src/components/dashboard/DeviceStatusChart.tsx` - Status pie chart
  - `client/src/components/dashboard/TemperatureChart.tsx` - Temperature line chart
  - `client/src/components/dashboard/RecentAlerts.tsx` - Recent alerts widget

#### 4. Authentication Components
- **Functionality**: Login, registration, and auth management
- **Key Files**:
  - `client/src/pages/Login.tsx` - Login page
  - `client/src/pages/Register.tsx` - Registration page
  - `client/src/contexts/AuthContext.tsx` - Auth context provider
  - `client/src/hooks/useAuth.ts` - Auth hook

## Data Flow

### Device Communication Flow
1. User initiates action (e.g., test connection, read registers)
2. Frontend calls API endpoint
3. Backend controller handles request
4. modbus-serial establishes connection to device
5. Data is read/written
6. Response is formatted and returned to frontend
7. Frontend updates UI with result

### Profile Application Flow
1. User selects profile and clicks "Apply"
2. Frontend calls `/api/profiles/:id/apply` endpoint
3. Backend retrieves profile and assigned devices
4. For each device:
   - Establishes Modbus connection
   - Writes register values based on profile settings
   - Records success/failure
5. Backend returns results to frontend
6. Frontend updates UI with results

## Key Interfaces

### Device Interface
```typescript
interface Device {
  _id: string;
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  registers: Register[];
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Register {
  name: string;
  address: number;
  length: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}
```

### Profile Interface
```typescript
interface Profile {
  _id: string;
  name: string;
  description?: string;
  targetTemperature: number;
  temperatureRange: [number, number];
  fanSpeed: number;
  mode: 'cooling' | 'heating' | 'auto' | 'dehumidify';
  schedule: Schedule;
  assignedDevices: string[];
  isTemplate: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Schedule {
  active: boolean;
  times: ScheduleTime[];
}

interface ScheduleTime {
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  startTime: string;
  endTime: string;
}
```

### User Interface
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // Hashed
  role: 'user' | 'engineer' | 'admin';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Implementation Priorities

1. **Setup and Authentication**
   - Set up project structure
   - Implement login/register
   - Set up authorization middleware

2. **Device Management**
   - Implement device CRUD operations
   - Develop Modbus communication functionality
   - Create device monitoring UI

3. **Profile Management**
   - Implement profile CRUD operations
   - Develop profile application logic
   - Create scheduling system

4. **Dashboard**
   - Implement status overview
   - Create data visualization components
   - Develop alerts system

5. **User Management**
   - Implement role management
   - Create permission system
   - Develop admin controls

## Testing Strategy

### Backend Testing
- Unit tests for controllers
- API endpoint testing
- Mock Modbus devices for communication testing

### Frontend Testing
- Component rendering tests
- Integration tests for forms
- Mock API for service testing

## Deployment Considerations
- Environment variables for production deployment
- MongoDB Atlas for production database
- PM2 for Node.js process management
- Docker containerization option

## Performance Optimization
- Implement pagination for device/profile lists
- Optimize Modbus communication for multiple devices
- Use React.memo for frequently re-rendered components