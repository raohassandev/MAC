// controllers/deviceController.js
const { Device } = require('../models');
const ModbusRTU = require('modbus-serial');

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single device
// @route   GET /api/devices/:id
// @access  Private
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new device
// @route   POST /api/devices
// @access  Private (Admin/Engineer)
exports.createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a device
// @route   PUT /api/devices/:id
// @access  Private (Admin/Engineer)
exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Update device
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDevice);
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a device
// @route   DELETE /api/devices/:id
// @access  Private (Admin/Engineer)
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await device.deleteOne();

    res.json({ message: 'Device removed', id: req.params.id });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Test connection to a device
// @route   POST /api/devices/:id/test
// @access  Private
exports.testDeviceConnection = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    if (!device.enabled) {
      return res.status(400).json({
        success: false,
        message: 'Device is disabled',
      });
    }

    // Test Modbus connection
    const client = new ModbusRTU();
    try {
      // Try to connect
      await client.connectTCP(device.ip, { port: device.port });
      client.setID(device.slaveId);

      // Try to read a register (first one if available, or address 0)
      const address =
        device.registers.length > 0 ? device.registers[0].address : 0;
      await client.readHoldingRegisters(address, 1);

      // Update device lastSeen timestamp
      device.lastSeen = new Date();
      await device.save();

      res.json({
        success: true,
        message: 'Successfully connected to device',
      });
    } catch (modbusError) {
      console.error('Modbus connection error:', modbusError);
      res.status(400).json({
        success: false,
        message: `Connection failed: ${modbusError.message}`,
      });
    } finally {
      // Close the connection
      client.close();
    }
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Read registers from a device
// @route   GET /api/devices/:id/read
// @access  Private
exports.readDeviceRegisters = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    if (!device.enabled) {
      return res.status(400).json({ message: 'Device is disabled' });
    }

    if (!device.registers || device.registers.length === 0) {
      return res
        .status(400)
        .json({ message: 'No registers configured for this device' });
    }

    // Initialize Modbus client
    const client = new ModbusRTU();
    const readings = [];

    try {
      // Connect to the device
      await client.connectTCP(device.ip, { port: device.port });
      client.setID(device.slaveId);

      // Read each configured register
      for (const register of device.registers) {
        try {
          const result = await client.readHoldingRegisters(
            register.address,
            register.length
          );

          // Process the result based on register configuration
          let value = result.data[0];

          // Apply scale factor if defined
          if (register.scaleFactor && register.scaleFactor !== 1) {
            value = value / register.scaleFactor;
          }

          // Format decimal places if defined
          if (register.decimalPoint && register.decimalPoint > 0) {
            value = parseFloat(value.toFixed(register.decimalPoint));
          }

          readings.push({
            name: register.name,
            address: register.address,
            value: value,
            unit: register.unit || '',
          });
        } catch (registerError) {
          readings.push({
            name: register.name,
            address: register.address,
            value: null,
            unit: register.unit || '',
            error: registerError.message,
          });
        }
      }

      // Update device lastSeen timestamp
      device.lastSeen = new Date();
      await device.save();

      res.json({
        deviceId: device._id,
        deviceName: device.name,
        timestamp: new Date(),
        readings,
      });
    } catch (modbusError) {
      console.error('Modbus reading error:', modbusError);
      res.status(400).json({
        message: `Failed to read from device: ${modbusError.message}`,
      });
    } finally {
      // Close the connection
      client.close();
    }
  } catch (error) {
    console.error('Read registers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
