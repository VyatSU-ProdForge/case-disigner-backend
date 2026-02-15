import { Image } from "../../models/index.js";

export default async (guid, options = {}) => {
  const image = await Image.findOne({
    where: { guid },
    ...options
  });
  
  return image?.toJSON ? image.toJSON() : image;
};