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
