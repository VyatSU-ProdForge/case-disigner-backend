import { DataTypes } from 'sequelize';
import sequelize from '../infrastructure/sequelize.js';
import User from './user.model.js';

const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },

  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // Материал (JSON, не обрабатываем)
  material: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },

  // Модель телефона (JSON, не обрабатываем)
  telephoneModel: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },

  // Трансформации изображения (JSON)
  imageTransform: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },

  // Цвет (hex-код или название)
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '#FFFFFF'
  },

  // URL изображения (опционально)
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Владелец (опционально — для публичных шаблонов может не быть)
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'guid'
    },
    onDelete: 'SET NULL'
  },

  // Публичный ли чехол
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }

}, {
  tableName: 'cases',
  timestamps: true, // createdAt, updatedAt
  paranoid: true, // deletedAt для мягкого удаления

});

// Связь с пользователем
User.hasMany(Case, {
  foreignKey: 'userId',
  as: 'cases'
});

Case.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export default Case;