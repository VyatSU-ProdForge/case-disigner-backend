import { v4 as uuidv4 } from 'uuid';
import { createCaseLink, updateCaseLink, getCaseLink } from '../repositories/caseImage/index.js';
import { NotFoundError} from '../errors/index.js';

export const saveCaseLink = async (data, userId) => {
  // Если есть ID
  if (data.id) {
    // Ищем существующий дизайн
    const existingCaseLink = await getCaseLink(data.id);

    if (!existingCaseLink) {
      throw new NotFoundError('Дизайн не найден', {
        code: 'ERR_CASELINK_NOT_FOUND'
      });
    }

    // Если владелец не совпадает — создаём копию
    if (existingCaseLink.userId !== userId) {
      const newCaseLinkData = {
        ...data,
        id: uuidv4(),           // новый GUID
        userId: userId,          // новый владелец
        sharedFrom: data.id,     // откуда скопировано (опционально)
        isPublic: false,         // по умолчанию непубличный
        createdAt: undefined,    // уберём, чтобы создать заново
        updatedAt: undefined
      };

      // Удаляем старый id, чтобы создать новый
      delete newCaseLinkData.id;

      const newCaseLink = await createCaseLink(newCaseLinkData);
      return newCaseLink;
    }

    // Если владелец совпадает — обновляем
    const updatedCaseLink = await updateCaseLink(data.id, data);
    return updatedCaseLink;
  }

  // Если нет ID — создаём новый
  const newCaseLinkData = {
    ...data,
    id: uuidv4(),           // новый GUID
    userId: userId,          // текущий пользователь
    isPublic: data.isPublic || false
  };

  // Удаляем старый id, если вдруг был
  delete newCaseLinkData.id;

  const newCaseLink = await createCaseLink(newCaseLinkData);
  return newCaseLink;
};