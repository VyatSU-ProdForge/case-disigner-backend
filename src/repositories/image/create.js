import { Image } from '../../models/index.js';

export default async (imageData, options = {}) => {

    const image = await Image.create(imageData, options);
    return image.toJSON ? image.toJSON() : image;
};