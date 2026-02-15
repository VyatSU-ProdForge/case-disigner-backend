import { getUserCases } from '../../repositories/case/index.js';
import { UnauthorizedError } from '../../errors/index.js';

export default async (req, res) => {
    if (!req.user.guid) {
      throw new UnauthorizedError('Требуется авторизация', {
        code: 'ERR_UNAUTHORIZED'
      });
    }

    const cases = await getUserCases(req.user.guid);

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
};