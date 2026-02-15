import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',

    db:{
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD ,
        database: process.env.DB_NAME ,
        host: process.env.DB_HOST ,
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
    },

    ai: {   
    apiKeyFreepik: process.env.API_KEY_FREEPIK || 'FPSXb36c4bfe8a4e1b806b004012e6dc35ce',
    }
};


