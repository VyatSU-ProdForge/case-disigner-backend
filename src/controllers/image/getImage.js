import path from 'path';
import { fileURLToPath } from 'url';
import { findImageByGuid } from '../../repositories/image/index.js';
import { NotFoundError } from '../../errors/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (req, res) => {
  const { guid } = req.params;

  const image = await findImageByGuid(guid);

  if (!image) {
    throw new NotFoundError('Изображение не найдено', {
      code: 'ERR_IMAGE_NOT_FOUND'
    });
  }

  // image.url = "/uploads/users/.../file.webp"
  const filePath = path.join(__dirname, '../../../', image.url);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Ошибка при отправке файла:', err);
      res.status(500).send('Ошибка при отправке файла');
    }
  });
};
