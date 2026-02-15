import { DataTypes } from 'sequelize';
import sequelize from '../infrastructure/sequelize.js';
import User from './user.model.js';

const Image = sequelize.define('Image', {
  guid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },

  // 🟢 СВЯЗЬ С ПОЛЬЗОВАТЕЛЕМ
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'guid'
    },
    onDelete: 'CASCADE'
  },

  // Уникальное имя файла на сервере
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // Публичный URL для фронта
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // MIME-тип (формат изображения)
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },

  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100
  },

  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100
  },

  positionX: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },

  positionY: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },

  // Тип загрузки
  type: {
    type: DataTypes.ENUM('user_upload', 'template', 'design'),
    defaultValue: 'user_upload',
    allowNull: false
  },

}, {
  tableName: 'images',
  timestamps: true,
  paranoid: true
});

// 🟢 СВЯЗИ
User.hasMany(Image, {
  foreignKey: 'userId',
  as: 'images',
  onDelete: 'CASCADE'
});

Image.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export default Image;