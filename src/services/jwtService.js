import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { 
  ValidationError,
  UnauthorizedError
} from '../errors/index.js';

export const generateToken = (payload) => {
    
    if (!payload) {
      throw new ValidationError('Payload не может быть пустым', {
        code: 'ERR_PAYLOAD_EMPTY'
      });
    }
    
    if (!payload.userId) {
      throw new ValidationError('Payload должен содержать userId', {
        code: 'ERR_PAYLOAD_MISSING_USER_ID'
      });
    }

    const token = jwt.sign(payload, config.secret, {
        expiresIn: config.expiresIn,
    });
    return token;

};

export const verifyToken = (token) => {

    if (!token) {
      throw new UnauthorizedError('Токен не предоставлен', {
        code: 'ERR_NO_TOKEN'
      });
    }
    const verify = jwt.verify(token, config.secret);
    return verify;
};

export const decodeToken = (token) => {
    return jwt.decode(token);
}