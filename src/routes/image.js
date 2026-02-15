import express from 'express';
import { uploadSingle } from '../../config/multer.js';
import uploadController from '../controllers/image/upload.js';
import getImage from '../controllers/image/getImage.js';
import getUserImages from '../controllers/image/getUserImages.js';
import { authMiddleware } from '../infrastructure/middleware/auth.js';
import updateImage from '../controllers/image/update.js';


const router = express.Router();

router.post(
  '/upload',
  authMiddleware,
  uploadSingle, 
  uploadController
);

router.get('/user', authMiddleware, getUserImages);
router.put('/ima/:guid', authMiddleware, updateImage);
router.get('/:guid', getImage);


export default router;