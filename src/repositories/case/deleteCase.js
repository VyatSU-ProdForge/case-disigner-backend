import { Case } from '../../models/index.js';

export default async (id, options = {}) => {
  const deletedRows = await Case.destroy({
    where: { id },
    ...options
  });

  return deletedRows > 0;
};