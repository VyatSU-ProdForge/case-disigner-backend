import { createUser, findUserByEmail } from '../../repositories/user/index.js';
import { generateToken } from '../../services/jwtService.js';
import { 
  ValidationError,
  ConflictError,
  InternalServerError
} from '../../errors/index.js';

export default async (req, res) => {

  console.log(req.body);
  
  const { firstName, lastName, patronymicName, email, phone, address, password } = req.body;

  const normalizedEmail = email?.toLowerCase().trim();
  
  // Минимальная валидация
  if (!firstName || !lastName || !normalizedEmail || !password) {
    throw new ValidationError('Заполните все обязательные поля', {
      code: 'ERR_REQUIRED_FIELDS_MISSING'
    });
  }
  
  if (password.length < 6) {
    throw new ValidationError('Пароль должен содержать минимум 6 символов', {
      code: 'ERR_PASSWORD_TOO_SHORT'
    });
  }
  
  // Проверка существования пользователя
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new ConflictError('Пользователь с таким email уже существует', {
      code: 'ERR_EMAIL_EXISTS',
      data: { email: normalizedEmail }
    });
  }
  
  // Создание пользователя
  const userJson = await createUser({
    firstName,
    lastName,
    patronymicName: patronymicName || null,
    email: normalizedEmail,
    phone: phone || null,
    address: address || null,
    password
  });

  // Генерация токена
  const tokenPayload = {
    userId: userJson.guid,
    email: userJson.email,
    firstName: userJson.firstName,
    lastName: userJson.lastName
  };

  const token = generateToken(tokenPayload);

  // Ответ
  res.status(201).json({
    success: true,
    message: 'Пользователь создан',
    data: {
      user: userJson,
      token,
      tokenType: 'Bearer'
    }
  });
};