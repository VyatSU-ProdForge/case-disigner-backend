# Базовый образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости (без dev зависимостей)
RUN npm ci --only=production

# Копируем весь код проекта
COPY . .

# Создаём папку для загрузок (она будет смонтирована позже)
RUN mkdir -p /app/uploads

# Открываем порт
EXPOSE 5000

# Запускаем сервер
CMD ["node", "index.js"]
