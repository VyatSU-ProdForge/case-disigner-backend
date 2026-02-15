import fetch from 'node-fetch';
import { 
  ApiKeyError,
  GenerationError,
  ValidationError
} from '../errors/index.js';

class AIImageService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new ApiKeyError('API ключ не предоставлен при инициализации сервиса', {
        code: 'ERR_API_KEY_MISSING'
      });
    }

    this.apiKey = apiKey;
    this.baseUrl = 'https://api.freepik.com/v1/ai/mystic';
  }

  // Создание задачи
  async generateImage(prompt, options = {}) {
    if (!prompt) {
      throw new ValidationError('Параметр "prompt" обязателен', {
        code: 'ERR_PROMPT_REQUIRED'
      });
    }

    const defaultOptions = {
      resolution: '2k',
      aspect_ratio: 'square_1_1',
      model: 'realism'
    };

    const body = {
      ...defaultOptions,
      ...options,
      prompt // prompt должен быть только здесь
    };

    console.log(`🔄 Отправляю запрос на генерацию: "${prompt}"`);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'x-freepik-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Ошибка Freepik:", data);
      throw new GenerationError('Freepik вернул ошибку при создании задачи', {
        code: 'ERR_FREEPIK_CREATE',
        data
      });
    }

    console.log(`✅ Задача создана: ${data.data.task_id}`);
    return data.data;
  }

  // Проверка статуса
  async checkTaskStatus(taskId) {
    const response = await fetch(`${this.baseUrl}/${taskId}`, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': this.apiKey
      }
    });

    const data = await response.json();
    return data.data;
  }

  // Полный цикл
  async generateAndWait(prompt, options = {}, checkInterval = 2000, maxAttempts = 30) {
    const task = await this.generateImage(prompt, options);

    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.checkTaskStatus(task.task_id);

      if (status.status === 'COMPLETED') {
        console.log(`✅ Изображение сгенерировано: ${status.generated[0]}`);
        return {
          success: true,
          imageUrl: status.generated[0],
          taskId: task.task_id
        };
      }

      if (status.status === 'FAILED') {
        throw new GenerationError('Генерация изображения не удалась', {
          code: 'ERR_GENERATION_FAILED',
          data: status
        });
      }

      await new Promise(r => setTimeout(r, checkInterval));
      attempts++;
      console.log(`⏳ Проверка ${attempts}/${maxAttempts}...`);
    }

    throw new GenerationError('Превышено время ожидания генерации', {
      code: 'ERR_TIMEOUT'
    });
  }
}

export default AIImageService;
