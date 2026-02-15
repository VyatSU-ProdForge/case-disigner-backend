import { Case } from '../../models/index.js';

export default async (data, options = {}) => {
  const case_ = await Case.create(data, options);
  return case_?.toJSON ? case_.toJSON() : case_;
};