import bcrypt from 'bcrypt';
import { findUserByEmail } from '../../repositories/user/index.js';
import { generateToken } from '../../services/jwtService.js';
import { 
  ValidationError,
  InvalidCredentialsError
} from '../../errors/index.js';

export default async (req, res) => {

  const { email, password } = req.body;
  
  // Валидация входных данных
  if (!email) {
    throw new ValidationError('Email обязателен', {
      code: 'ERR_EMAIL_REQUIRED'
    });
  }
  
  if (!password) {
    throw new ValidationError('Пароль обязателен', {
      code: 'ERR_PASSWORD_REQUIRED'
    });
  }

  // Поиск пользователя (с паролем)
  const user = await findUserByEmail(email, { raw: true });
  
  if (!user) {
      // Одинаковое сообщение для безопасности (не говорим, что именно неверно)
      throw new InvalidCredentialsError('Пользователь не найден', {
        code: 'ERR_USER_NOT_FOUND'
      });
  }

  // Проверка пароля
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    throw new InvalidCredentialsError({
      code: 'ERR_WRONG_PASSWORD'
    });
  }

  // Удаляем пароль
  delete user.password;

  // Генерация токена
  const tokenPayload = {
    userId: user.guid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };

  const token = generateToken(tokenPayload);

  // Ответ
  res.json({
    success: true,
    message: 'Вход выполнен',
    data: {
      user,
      token,
      tokenType: 'Bearer'
    }
  });
};