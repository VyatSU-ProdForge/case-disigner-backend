import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Создаём папку для временных файлов
const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Настройка хранилища (диск)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // сначала сохраняем во временную папку
  },
  filename: (req, file, cb) => {
    // Уникальное имя: timestamp_originalname
    const uniqueName = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
    cb(null, uniqueName);
  }
});

// Фильтр файлов — только изображения
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Можно загружать только изображения (JPEG, PNG, WEBP, SVG)'), false);
  }
};

// Лимиты
const limits = {
  fileSize: 10 * 1024 * 1024 // 10 MB
};

// Конфиг для загрузки одного файла
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits
}).single('image'); // поле в form-data должно называться 'image'

// Конфиг для памяти (если нужно обработать до сохранения)
export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits
}).single('image');

export default { uploadSingle, memoryUpload };