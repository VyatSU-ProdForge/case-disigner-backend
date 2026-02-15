export const errorHandler = (err, req, res, next) => {
  console.error('❌ Глобальная ошибка:', err);

  // Кастомные ошибки
  if (err.name === 'NotFoundError' || 
      err.name === 'ValidationError' || 
      err.name === 'UnauthorizedError' ||
      err.name === 'ConflictError' ||
      err.name === 'AiServiceError' ||
      err.name === 'GenerationError' ||
      err.name === 'ApiKeyError' ||
      err.name === 'InvalidCredentialsError') {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }

  // Ошибки валидации Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Ошибка валидации',
      details: err.errors.map(e => e.message)
    });
  }

  // Непредвиденная ошибка
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    code: 'ERR_INTERNAL'
  });
};