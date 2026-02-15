import AIImageService from '../../infrastructure/aiImageService.js';
import { config } from '../../../config/config.js';
import { ValidationError, ApiKeyError, NotFoundError } from '../../errors/index.js';

// Инициализируем сервис с ключом из .env
const aiService = new AIImageService(config.ai.apiKeyFreepik);

  // Проверка статуса задачи
  export default async(req, res) => {
      const { taskId } = req.params;

      if (!taskId) {
        throw new ValidationError('Параметр "taskId" обязателен', {
          code: 'ERR_TASK_ID_REQUIRED'
        });
      }

      if (!config.ai.apiKeyFreepik) {
        throw new ApiKeyError('API ключ не настроен в конфигурации', {
          code: 'ERR_API_KEY_MISSING'
        });
      }

      const status = await aiService.checkTaskStatus(taskId);

      // Проверка ответа
      if (!status) {
        throw new NotFoundError('Задача не найдена', {
          code: 'ERR_TASK_NOT_FOUND',
          resource: 'task',
          data: { taskId }
        });
      }
      
      res.json({
        success: true,
        status: status.status,
        imageUrl: status.generated?.[0],
        taskId: taskId
      });
  };