import { getCaseById, deleteCase } from '../../repositories/case/index.js';
import { NotFoundError, UnauthorizedError } from '../../errors/index.js';

export default async (req, res) => {
    const { id } = req.params;

    if (!req.user?.guid) {
      throw new UnauthorizedError('Требуется авторизация', {
        code: 'ERR_UNAUTHORIZED'
      });
    }

    const existingCase = await getCaseById(id);

    if (!existingCase) {
      throw new NotFoundError('Чехол не найден', {
        code: 'ERR_CASE_NOT_FOUND'
      });
    }

    if (existingCase.userId !== req.user.guid) {
      throw new UnauthorizedError('Нет доступа к этому чехлу', {
        code: 'ERR_ACCESS_DENIED'
      });
    }

    const deleted = await deleteCase(id);

    res.json({
      success: true,
      message: 'Чехол удалён',
      data: { id }
    });
};