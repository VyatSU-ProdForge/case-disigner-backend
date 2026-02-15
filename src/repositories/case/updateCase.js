import { Case } from '../../models/index.js';

export default async (id, updateData, options = {}) => {
  const [updatedRows] = await Case.update(updateData, {
    where: { id },
    ...options
  });

  if (updatedRows === 0) return null;

  const updatedCase = await Case.findByPk(id, options);
  return updatedCase?.toJSON ? updatedCase.toJSON() : updatedCase;
};