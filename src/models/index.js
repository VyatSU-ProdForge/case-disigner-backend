import sequelize from "../infrastructure/sequelize.js";
import User from './user.model.js';
import Image from "./image.model.js";
//import CaseLink from "./caseImage.model.js";
import Case from "./case.model.js";

const models = { 
  User,
  Image,
  //CaseLink,
  Case
};

// Единая функция инициализации 
const initializeDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('✅ База данных инициализирована');

// Создаём чехол по умолчанию, если его нет
  //   const [baseCase] = await Case.findOrCreate({
  //     where: { name: 'Базовый чехол' },
  //     defaults: {
  //       name: 'Базовый чехол',
  //       fileName: 'default_case.webp',
  //       url: '/uploads/cases/case.webp',
  //       mimeType: 'image/webp',
  //       width: 1200,
  //       height: 2000,
  //       rotation: 0
  //   }
  // });

    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error);
    throw error;
  }
};

export {
    initializeDatabase,
    User,
    Image,
   // CaseLink,
    Case,
    models,
    sequelize
}