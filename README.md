# MacSys - Modbus Device Management System

## 🚀 Project Overview

MacSys is a comprehensive Modbus device management system designed to monitor, configure, and interact with industrial devices.

## 📋 Project Structure

### Key Directories
- `macsys_engine/`: Backend Node.js/Express application
- `macsys_web/`: Frontend React application
- `config/`: Configuration files
- `scripts/`: Utility scripts

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or Yarn
- MongoDB

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/macsys.git
cd macsys
```

2. Install Dependencies
```bash
# Install backend dependencies
cd macsys_engine
npm install

# Install frontend dependencies
cd ../macsys_web
npm install
```

3. Configure Environment
- Copy `.env.example` to `.env` in both `macsys_engine` and `macsys_web`
- Update configuration values

4. Start Development Servers
```bash
# In macsys_engine directory
npm run dev

# In macsys_web directory
npm run dev
```

## 🔧 Configuration

### Backend Configuration (macsys_engine/.env)
```
PORT=3333
MONGO_URI=mongodb://localhost:27017/modbus
REALTIME_INTERVAL_MS=1000
HISTORICAL_INTERVAL_MS=60000
```

### Frontend Configuration (macsys_web/.env)
```
VITE_API_BASE=http://localhost:3333
```

## 💻 Development Workflow

### Git Workflow
1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Commit changes
```bash
git add .
git commit -m "Description of changes"
```

3. Push to remote
```bash
git push origin feature/your-feature-name
```

### Running Tests
```bash
# Backend tests
cd macsys_engine
npm test

# Frontend tests
cd macsys_web
npm test
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
MIT License