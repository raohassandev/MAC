# MacSys - Modbus Device Management System

A modern web application for managing Modbus-enabled devices, built with React, Vite, TypeScript, and Node.js.

## Project Structure

The project is organized into two main parts:

- **Backend**: Node.js/Express server with Modbus communication capabilities
- **Client**: React application with TypeScript and Vite

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Setting up the Project

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd macsys
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3333
   MONGO_URI=mongodb://localhost:27017/macsys
   ```

## Running the Application

### Development Mode

To run both the client and server in development mode:

```bash
npm start
```

This will start:
- The backend server on port 3333
- The React development server on port 3000 with hot reloading

### Running Only the Backend

```bash
npm run server
```

### Running Only the Frontend

```bash
npm run client
```

## Building for Production

To create a production build of the client:

```bash
cd client
npm run build
```

The build output will be available in the `client/dist` directory.

## License

MIT