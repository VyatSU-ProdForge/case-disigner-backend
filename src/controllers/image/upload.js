import { createImage } from '../../repositories/image/index.js';
import { processImage } from '../../../config/sharp.js';
import {
  UnauthorizedError,
  ValidationError
} from '../../errors/index.js';

export default async (req, res) => {
  // 1. Проверяем авторизацию
  //console.log('📦 req.file:', req.file);

  if (!req.user || !req.user.guid) {
    throw new UnauthorizedError('Требуется авторизация', {
      code: 'ERR_UNAUTHORIZED'
    });
  }

  // 2. Проверяем наличие файла
  if (!req.file) {
    throw new ValidationError('Файл не загружен', {
      code: 'ERR_FILE_REQUIRED'
    });
  }
  console.log(req.file);
  // 3. Обрабатываем изображение
  const processed = await processImage(req.file, req.user.guid);

  // 4. Сохраняем в БД — displayWidth/displayHeight = width/height
  const image = await createImage({
    userId: req.user.guid,
    fileName: processed.fileName,
    url: processed.url,
    mimeType: processed.mimeType,
    width: processed.width,
    height: processed.height,
    positionX: 0,
    positionY: 0,
    type: 'user_upload'
  });

  //const imageJson = image.toJSON ? image.toJSON() : image;
  const imageLink = `http://localhost:5000/api/image/${image.guid}`;

  // 5. Успешный ответ
  res.status(201).json({
    success: true,
    message: 'Изображение загружено',
    data: imageLink,
  });    
};