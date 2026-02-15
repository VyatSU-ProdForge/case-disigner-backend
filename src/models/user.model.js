import { DataTypes } from 'sequelize';
import sequelize from '../infrastructure/sequelize.js'; 
import { v4 as uuidv4 } from 'uuid';

const User = sequelize.define('User', {
  // guid - уникальный идентификатор
  guid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  
  // Имя
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Имя обязательно для заполнения'
      },
      len: {
        args: [2, 100],
        msg: 'Имя должно содержать от 2 до 100 символов'
      }
    }
  },
  
  // Отчество
  patronymicName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Отчество не должно превышать 100 символов'
      }
    }
  },
  
  // Фамилия
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Фамилия обязательна для заполнения'
      },
      len: {
        args: [2, 100],
        msg: 'Фамилия должна содержать от 2 до 100 символов'
      }
    }
  },
  
  // Email (уникальный)
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'Пользователь с таким email уже существует'
    },
    validate: {
      notEmpty: {
        msg: 'Email обязателен для заполнения'
      },
      isEmail: {
        msg: 'Некорректный формат email'
      }
    }
  },
  
  // Телефон
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^[\+]?[0-9\s\-\(\)]+$/,
        msg: 'Некорректный формат телефона'
      }
    }
  },
  
  // Адрес
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Пароль (будет хеширован)
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Пароль обязателен для заполнения'
      },
      len: {
        args: [6, 255],
        msg: 'Пароль должен содержать минимум 6 символов'
      }
    }
  }

}, {
  // Опции модели
  tableName: 'users',
  //timestamps: true, // Добавляет createdAt и updatedAt автоматически
  paranoid: true, // Добавляет deletedAt для мягкого удаления
  
  hooks: {
    // Хук перед созданием/обновлением для хеширования пароля
    beforeCreate: async (user) => {
      if (!user.guid) {
        user.guid = uuidv4();
        }
      if (user.password) {
        const bcrypt = await import('bcrypt');
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const bcrypt = await import('bcrypt');
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);

        user.updatedAt = new Date();
      }
    }
  }
});

// Метод для проверки пароля
User.prototype.validatePassword = async function(password) {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, this.password);
};

// Метод для безопасного представления пользователя (без пароля)
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

export default User;