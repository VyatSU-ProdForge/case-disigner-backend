import { Image } from "../../models/index.js";

export default async (userId, options = {}) => {
  const images = await Image.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    ...options
  });
  
  return images.map(image => image.toJSON ? image.toJSON() : image);
};