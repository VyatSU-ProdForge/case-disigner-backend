import { getCaseById } from '../../repositories/case/index.js';
import { NotFoundError, UnauthorizedError } from '../../errors/index.js';

export default async (req, res) => {
    const { id } = req.params;

    const case_ = await getCaseById(id);

    if (!case_) {
      throw new NotFoundError('Чехол не найден', {
        code: 'ERR_CASE_NOT_FOUND'
      });
    }

    // Если чехол не публичный и не принадлежит пользователю
    if (!case_.isPublic && case_.userId !== req.user?.guid) {
      throw new UnauthorizedError('Нет доступа к этому чехлу', {
        code: 'ERR_ACCESS_DENIED'
      });
    }

    res.json({
      success: true,
      data: case_
    });
};