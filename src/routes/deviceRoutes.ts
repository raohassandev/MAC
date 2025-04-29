// routes/deviceRoutes.js
const express = require('express');
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  testDeviceConnection,
  readDeviceRegisters,
} = require('../controllers/deviceController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router
  .route('/')
  .get(getDevices)
  .post(checkPermission(['manage_devices']), createDevice);

router
  .route('/:id')
  .get(getDeviceById)
  .put(checkPermission(['manage_devices']), updateDevice)
  .delete(checkPermission(['manage_devices']), deleteDevice);

router.post('/:id/test', testDeviceConnection);
router.get('/:id/read', readDeviceRegisters);

module.exports = router;
