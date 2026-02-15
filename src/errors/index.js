// 400 - Ошибки валидации
export class ValidationError extends Error {
  constructor(message = 'Ошибка валидации данных', options = {}) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = options.code || 'ERR_VALIDATION';
    this.errors = options.errors || [];
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 401 - Ошибки авторизации
export class UnauthorizedError extends Error {
  constructor(message = 'Требуется авторизация', options = {}) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.code = options.code || 'ERR_UNAUTHORIZED';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 - Не найдено
export class NotFoundError extends Error {
  constructor(message = 'Ресурс не найден', options = {}) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = options.code || 'ERR_NOT_FOUND';
    this.resource = options.resource || null;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 409 - Конфликт
export class ConflictError extends Error {
  constructor(message = 'Ресурс уже существует', options = {}) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.code = options.code || 'ERR_CONFLICT';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Ошибки AI сервиса
export class AiServiceError extends Error {
  constructor(message = 'Ошибка AI сервиса', options = {}) {
    super(message);
    this.name = 'AiServiceError';
    this.statusCode = options.statusCode || 502;
    this.code = options.code || 'ERR_AI_SERVICE';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class GenerationError extends AiServiceError {
  constructor(message = 'Ошибка генерации изображения', options = {}) {
    super(message);
    this.name = 'GenerationError';
    this.code = options.code || 'ERR_GENERATION_FAILED';
  }
}

export class ApiKeyError extends AiServiceError {
  constructor(message = 'Неверный API ключ', options = {}) {
    super(message);
    this.name = 'ApiKeyError';
    this.statusCode = 401;
    this.code = options.code || 'ERR_INVALID_API_KEY';
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message = 'Неверный email или пароль', options = {}) {
    super(message);
    this.name = 'InvalidCredentialsError';
    this.code = options.code || 'ERR_INVALID_CREDENTIALS';
  }
}

// 500+ - Ошибки сервера
export class InternalServerError extends Error {
  constructor(message = 'Внутренняя ошибка сервера', options = {}) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
    this.code = options.code || 'ERR_INTERNAL';
    
    Error.captureStackTrace(this, this.constructor);
  }
}