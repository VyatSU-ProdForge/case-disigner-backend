import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Обрабатывает изображение: сжатие, ресайз, конвертация

export const processImage = async (file, userId) => {
  try {
    // 1. Создаём папку пользователя
    const userDir = path.join(__dirname, `../uploads/users/${userId}`);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // 2. Генерируем уникальное имя файла
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    const safeName = `${baseName.replace(/\s/g, '_')}_${timestamp}.webp`;
    const outputPath = path.join(userDir, safeName);
    const relativePath = `/uploads/users/${userId}/${safeName}`;

    // 3. Открываем файл через sharp
    let sharpInstance = sharp(file.path);

    // 4. Получаем метаданные (размер)
    const metadata = await sharpInstance.metadata();

    // 5. Ресайз (максимум 1600px, сохраняем пропорции)
    sharpInstance = sharpInstance.resize({
      width: Math.min(metadata.width || 1600, 1600),
      height: Math.min(metadata.height || 1600, 1600),
      fit: 'inside',
      withoutEnlargement: true
    });

    // 6. Конвертируем в WebP с качеством 80%
    sharpInstance = sharpInstance.webp({ quality: 80 });

    // 7. Сохраняем файл
    await sharpInstance.toFile(outputPath);

    // 8. Удаляем временный файл
    fs.unlinkSync(file.path);

    // 9. Возвращаем информацию для БД
    return {
      fileName: safeName,
      url: relativePath,
     // size: fs.statSync(outputPath).size,
      mimeType: 'image/webp',
      width: metadata.width,
      height: metadata.height
    };

  } catch (error) {
    // Если ошибка — удаляем временный файл
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Ошибка обработки изображения: ${error.message}`);
  }
};

export default { processImage };