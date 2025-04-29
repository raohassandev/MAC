// routes/authRoutes.js
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;

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

// routes/profileRoutes.js
const express = require('express');
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  duplicateProfile,
  applyProfile,
  getTemplateProfiles,
  createFromTemplate,
} = require('../controllers/profileController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router
  .route('/')
  .get(getProfiles)
  .post(checkPermission(['manage_profiles']), createProfile);

router
  .route('/:id')
  .get(getProfileById)
  .put(checkPermission(['manage_profiles']), updateProfile)
  .delete(checkPermission(['manage_profiles']), deleteProfile);

router.post(
  '/:id/duplicate',
  checkPermission(['manage_profiles']),
  duplicateProfile
);
router.post('/:id/apply', checkPermission(['manage_profiles']), applyProfile);
router.get('/templates', getTemplateProfiles);
router.post(
  '/from-template/:templateId',
  checkPermission(['manage_profiles']),
  createFromTemplate
);

module.exports = router;

// routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const deviceRoutes = require('./deviceRoutes');
const profileRoutes = require('./profileRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
