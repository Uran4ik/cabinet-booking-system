import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';  

const router = express.Router();

// Валидация регистрации
const registerValidator = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов'),
  body('name').optional().isString(),
];

// Валидация входа
const loginValidator = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

const updateProfileValidator = [
  body('name').notEmpty().withMessage('Имя обязательно'),
];

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, updateProfileValidator, authController.updateProfile);

export default router;