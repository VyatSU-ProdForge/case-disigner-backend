import { User } from '../../models/index.js';

export default async (email, options = {}) => {
  const defaultOptions = {
    where: { email },
    ...options
  };
  
  return await User.findOne(defaultOptions);
};