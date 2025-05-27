import express from 'express';
import { body } from 'express-validator';
import { login, logout, signup, getallusers, seedAdmin, me } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  signup
);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min:6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  login
)
router.post('/logout', logout)
router.get('/users', getallusers)
router.post('/seedadmin', seedAdmin)
router.get('/me', me)

export default router;
