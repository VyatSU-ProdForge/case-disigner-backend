import express from 'express';
import registerController from '../controllers/auth/register.js';
import loginController from '../controllers/auth/login.js';

const router = express.Router();

// Публичные маршруты
router.post('/register', registerController);
router.post('/login', loginController);

export default router;