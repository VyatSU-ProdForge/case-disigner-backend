import { findImageByUser } from "../../repositories/image/index.js";
import { UnauthorizedError, NotFoundError } from "../../errors/index.js";

export default async(req, res) => {
    if(!req.user || !req.user.guid){
        throw new UnauthorizedError('Требуется авторизация', {
            code: 'ERR_UNAUTHIRIZED'
        });
    }

    const images = await findImageByUser(req.user.guid);

    if(!images){
        throw new NotFoundError('Изображение не найдено', {
            code: 'ERR_IMAGE_NOT_FOUND'
        });
    }

    res.json({
        success: true,
        count: images.length,
        data: images
    });
};