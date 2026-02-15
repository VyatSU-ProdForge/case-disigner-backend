import { findImageByGuid, updateImage } from "../../repositories/image/index.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/index.js";

export default async(req, res) => {
    console.log('🔄 Контроллер обновления вызван');

    const {guid} = req.params;
    const {positionX, positionY, width, height} = req.body;

    if(!req.user || !req.user.guid){
        throw new UnauthorizedError('Требуется авторизация', {
            code: 'ERR_UNATHORIZED'
        });
    }

    // Проверяем, что есть хотя бы одно поле для обновления
    if (positionX === undefined && positionY === undefined && 
        width === undefined && height === undefined) {
      throw new ValidationError('Нет данных для обновления', {
        code: 'ERR_NO_DATA'
      });
    }

    const image = await findImageByGuid(guid);

    if(!image){
        throw new NotFoundError('Не найдено изображение', {
            code: 'ERR_NOT_FOUND'
        });
    }

    const updateData = {};
    if(positionX !== undefined) updateData.positionX = positionX;
    if (positionY !== undefined) updateData.positionY = positionY;
    if (width !== undefined) updateData.width = width;
    if (height !== undefined) updateData.height = height;

    const updatedImage = await updateImage(guid, updateData);

    res.json({
        success: true,
        message: 'Изображение обновлено',
        data: updatedImage
    });
}