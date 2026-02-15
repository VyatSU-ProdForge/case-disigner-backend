import { Image } from "../../models/index.js";

export default async (guid, updateData, options = {}) => {

    const [updateRows] = await Image.update(updateData, {
        where: {guid},
        ...options
    });
    //возврат обновленного изображения
    const updateImage = await Image.findOne({
        where: {guid},
        ...options
    });
    return updateImage?.toJSON ? updateImage.toJSON():updateImage;
}