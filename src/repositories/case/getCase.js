import { Case } from '../../models/index.js';

export default async (id, options = {}) => {
  const case_ = await Case.findByPk(id, options);
  return case_?.toJSON ? case_.toJSON() : case_;
};