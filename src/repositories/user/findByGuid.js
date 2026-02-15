import { User } from '../../models/index.js';

export default async (guid, options = {}) => {
  const defaultOptions = {
    where: { guid },
    ...options
  };
  
  return await User.findOne(defaultOptions);
};