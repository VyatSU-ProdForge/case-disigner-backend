    import express from 'express';
    import cors from 'cors';
    import { config } from './config/config.js'; 
    import { initializeDatabase } from './src/models/index.js';
    import { imageAI, auth, image, caseRoutes } from './src/routes/index.js';
    import path from 'path';
    import { fileURLToPath } from 'url';
    import { errorHandler } from './src/infrastructure/middleware/errorHandler.js';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const app = express();

    app.use(cors());
    app.use(express.json()); // Парсит JSON
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
    res.send('Hello!');
    });
    
    app.use('/api/imageAI', imageAI);
    app.use('/api/auth', auth);
    app.use('/api/image', image);
    app.use('/api/', caseRoutes);
    //app.use('/api/', caseImage);

    // Раздаём статику из папки uploads
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.use(errorHandler);

    const startServer = async () => {
    try {
        // 1. Проверяем подключение к БД
        console.log('🔄 Проверяем подключение к базе данных...');
        await initializeDatabase();
        
        // 2. Запускаем сервер
        app.listen(config.port, () => {
        console.log('✅ СЕРВЕР ЗАПУЩЕН УСПЕШНО!');
        console.log(`📍 Локально:    http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('❌ Не удалось запустить сервер:', error.message);
        process.exit(1);
    }
    };

    // Запускаем сервер
    startServer();