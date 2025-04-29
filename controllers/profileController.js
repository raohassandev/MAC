// controllers/profileController.js
const { Profile, Device } = require('../models');
const ModbusRTU = require('modbus-serial');

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Private
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate(
      'assignedDevices',
      'name ip enabled'
    );
    res.json(profiles);
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single profile
// @route   GET /api/profiles/:id
// @access  Private
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate(
      'assignedDevices',
      'name ip enabled'
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new profile
// @route   POST /api/profiles
// @access  Private
exports.createProfile = async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a profile
// @route   PUT /api/profiles/:id
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a profile
// @route   DELETE /api/profiles/:id
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await profile.deleteOne();

    res.json({ message: 'Profile removed', id: req.params.id });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Duplicate a profile
// @route   POST /api/profiles/:id/duplicate
// @access  Private
exports.duplicateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Create a copy of the profile
    const profileData = profile.toObject();
    delete profileData._id;
    profileData.name = `${profileData.name} (Copy)`;
    profileData.createdAt = new Date();
    profileData.updatedAt = new Date();

    const newProfile = await Profile.create(profileData);

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Duplicate profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Apply profile to assigned devices
// @route   POST /api/profiles/:id/apply
// @access  Private
exports.applyProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate(
      'assignedDevices'
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (!profile.assignedDevices || profile.assignedDevices.length === 0) {
      return res
        .status(400)
        .json({ message: 'No devices assigned to this profile' });
    }

    // Results of applying profile to each device
    const results = [];

    // For each assigned device, apply the profile settings
    for (const device of profile.assignedDevices) {
      if (!device.enabled) {
        results.push({
          deviceId: device._id,
          deviceName: device.name,
          success: false,
          message: 'Device is disabled',
        });
        continue;
      }

      const client = new ModbusRTU();

      try {
        // Connect to the device
        await client.connectTCP(device.ip, { port: device.port });
        client.setID(device.slaveId);

        // Apply profile settings (for demonstration - this would be custom per device type)
        // This is just an example - the actual implementation would depend on device specifics

        // Setting target temperature (assuming register address 100)
        await client.writeRegisters(100, [
          Math.round(profile.targetTemperature * 10),
        ]);

        // Setting fan speed (assuming register address 101)
        await client.writeRegisters(101, [profile.fanSpeed]);

        // Setting mode (assuming register address 102)
        const modeValue =
          {
            cooling: 1,
            heating: 2,
            auto: 3,
            dehumidify: 4,
          }[profile.mode] || 1;

        await client.writeRegisters(102, [modeValue]);

        // Update device lastSeen timestamp
        device.lastSeen = new Date();
        await device.save();

        results.push({
          deviceId: device._id,
          deviceName: device.name,
          success: true,
          message: 'Profile applied successfully',
        });
      } catch (modbusError) {
        console.error(
          `Modbus error applying profile to device ${device.name}:`,
          modbusError
        );
        results.push({
          deviceId: device._id,
          deviceName: device.name,
          success: false,
          message: `Failed to apply profile: ${modbusError.message}`,
        });
      } finally {
        // Close the connection
        client.close();
      }
    }

    res.json({
      profileId: profile._id,
      profileName: profile.name,
      timestamp: new Date(),
      results,
    });
  } catch (error) {
    console.error('Apply profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all template profiles
// @route   GET /api/profiles/templates
// @access  Private
exports.getTemplateProfiles = async (req, res) => {
  try {
    const templates = await Profile.find({ isTemplate: true });
    res.json(templates);
  } catch (error) {
    console.error('Get template profiles error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a profile from template
// @route   POST /api/profiles/from-template/:templateId
// @access  Private
exports.createFromTemplate = async (req, res) => {
  try {
    const template = await Profile.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template profile not found' });
    }

    if (!template.isTemplate) {
      return res
        .status(400)
        .json({ message: 'Specified profile is not a template' });
    }

    // Create a new profile based on the template
    const profileData = template.toObject();
    delete profileData._id;

    // Override with user-provided values
    const { name, description, assignedDevices } = req.body;

    profileData.name = name || `${profileData.name} (Copy)`;
    if (description) profileData.description = description;

    // New profile is not a template
    profileData.isTemplate = false;

    // Set assigned devices if provided
    if (assignedDevices) {
      profileData.assignedDevices = assignedDevices;
    } else {
      profileData.assignedDevices = [];
    }

    // Reset timestamps
    profileData.createdAt = new Date();
    profileData.updatedAt = new Date();

    const newProfile = await Profile.create(profileData);

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Create from template error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
