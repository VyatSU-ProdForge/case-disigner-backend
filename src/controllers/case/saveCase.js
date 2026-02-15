import { saveCase } from '../../repositories/case/index.js';
import { UnauthorizedError } from '../../errors/index.js';

export default async (req, res) => {
    if (!req.user?.guid) {
      throw new UnauthorizedError('Требуется авторизация', {
        code: 'ERR_UNAUTHORIZED'
      });
    }

    const caseData = req.body;
    const result = await saveCase(caseData, req.user.guid);

    res.json({
      success: true,
      message: 'Чехол сохранён',
      data: result
    });
};