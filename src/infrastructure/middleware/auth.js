// Импортируем как обычные функции, а не класс
import { verifyToken } from '../../services/jwtService.js';
import { findUserByGuid } from '../../repositories/user/index.js';
import { NotFoundError, UnauthorizedError } from '../../errors/index.js';

/**
 * Middleware для проверки JWT аутентификации
 */
export const authMiddleware = async (req, res, next) => {
    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedError('Требуется авторизация. Не предоставлен токен.', {
        code: 'ERR_NO_TOKEN'
      });
    }
    
    // Убираем 'Bearer ' если есть
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    const decoded = verifyToken(token);
    
    // Находим пользователя в БД
    const user = await findUserByGuid(decoded.userId);
    
    if (!user) {
      throw new NotFoundError('Пользователь не найден', {
        code: 'ERR_USER_NOT_FOUND',
        resource: 'user',
        data: { userId: decoded.userId }
      });
    }
    
    // Добавляем пользователя в запрос
    req.user = user;
    req.userId = decoded.userId;
    
    next();
};

export default authMiddleware;