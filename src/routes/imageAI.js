import express from 'express';
import generateFromText from '../controllers/AI/imageGeneration.js';
import generateQuick from '../controllers/AI/quickGeneration.js';
import checkStatus from '../controllers/AI/status.js';
import authMiddleware from '../infrastructure/middleware/auth.js';

const router = express.Router();

// Генерация изображения по тексту
router.post('/generate', authMiddleware, generateFromText);

// Быстрая генерация (async)
router.post('/generate-quick', authMiddleware, generateQuick);

// Проверка статуса
router.get('/status/:taskId', authMiddleware, checkStatus);

export default router;