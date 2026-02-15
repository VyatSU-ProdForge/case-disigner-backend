import { User } from '../../models/index.js';

export default async (userData, options = {}) => {
    const user = await User.create(userData, options);
    //return await User.create(userData, options);
    return user.toJSON();
};