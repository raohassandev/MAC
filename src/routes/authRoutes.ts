import * as authController from '../controllers/authController';

import { Router } from 'express';
import express from 'express';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Use RequestHandler type for the middleware
router.post('/register', authController.register as express.RequestHandler);
router.post('/login', authController.login as express.RequestHandler);
router.get(
  '/me',
  protect as express.RequestHandler,
  authController.getMe as express.RequestHandler
);

export default router;
