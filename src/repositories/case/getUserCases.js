import { Case } from '../../models/index.js';

export default async (userId, options = {}) => {
  const cases = await Case.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    ...options
  });

  return cases.map(c => c.toJSON ? c.toJSON() : c);
};