import { v4 as uuidv4 } from 'uuid';
import { Case } from '../../models/index.js';
import getCaseById from './getCase.js';
import createCase from './createCase.js';
import updateCase from './updateCase.js';

export const saveCase = async (caseData, userId) => {
  // Если есть ID
  if (caseData.id) {
    // Ищем существующий чехол
    const existingCase = await getCaseById(caseData.id);

    if (existingCase) {
      // Если владелец не совпадает — создаём копию
      if (existingCase.userId !== userId) {
        const newCaseData = {
          ...caseData,
          id: uuidv4(),           // новый ID
          userId: userId,          // новый владелец
          isPublic: false,         // копии по умолчанию непубличные
          createdAt: undefined,    // уберём, чтобы создать заново
          updatedAt: undefined
        };

        // Удаляем старый id, чтобы создать новый
        delete newCaseData.id;

        return await createCase(newCaseData);
      }

      // Если владелец совпадает — обновляем
      return await updateCase(caseData.id, caseData);
    }
  }

  // Если нет ID или чехол не найден — создаём новый
  const newCaseData = {
    ...caseData,
    id: caseData.id || uuidv4(),  // используем переданный ID или новый
    userId: userId,                // текущий пользователь
    isPublic: caseData.isPublic || false
  };

  // Если передан ID, но чехол не найден — создаём с этим ID
  return await createCase(newCaseData);
};