import express from 'express';
import { authMiddleware } from '../infrastructure/middleware/auth.js';
import saveCaseController from '../controllers/case/saveCase.js';
import getCaseController from '../controllers/case/getCase.js';
import getUserCasesController from '../controllers/case/getUserCases.js';
import deleteCaseController from '../controllers/case/deleteCase.js';

const router = express.Router();

// Публичные роуты (не требуют авторизации)
// router.get('/cases/public/:id', getCaseController); // публичный чехол по ID
router.get('/cases/:id', getCaseController);         // свой чехол по ID

// Защищённые роуты
router.use(authMiddleware);

router.post('/cases/save', saveCaseController);      // основной метод Save
router.get('/cases', getUserCasesController);        // все мои чехлы
router.delete('/cases/:id', deleteCaseController);   // удалить

export default router;