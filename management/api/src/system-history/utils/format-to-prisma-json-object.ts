import { Decimal } from '@prisma/client/runtime';

export const formatToPrismaJsonObject = (object: unknown) => {
  const jsonObject = {};

  if (!object) {
    return jsonObject;
  }

  if (typeof object === 'string') {
    return object;
  }

  if (
    typeof object === 'number' ||
    typeof object === 'boolean' ||
    object instanceof Decimal
  ) {
    return object.toString();
  }

  Object.entries(object).forEach(([key, value]) => {
    jsonObject[key] = format(value);
  });

  return jsonObject;
};

const format = (value: unknown) => {
  if (value instanceof Date) {
    return value.toJSON();
  }

  if (Array.isArray(value)) {
    const array = [];
    const valueArray = Array.from(value);

    valueArray.forEach((item) => {
      array.push(formatToPrismaJsonObject(item));
    });

    return array;
  }

  if (typeof value === 'object' && value) {
    return formatToPrismaJsonObject(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }

  return value;
};
