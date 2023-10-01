import { allowedStatusGeneric } from '../functions';

export const dto = {
  required: (field: string) => `O campo "${field}" é obrigatório.`,
  string: (field: string) => `O campo "${field}" deve ser uma string.`,
  number: (field: string) => `O campo "${field}" deve ser um número.`,
  email: (field: string) => `O campo "${field}" deve ser um e-mail.`,
  object: (field: string) => `O campo "${field}" deve ser um objeto.`,
  enum: <T>(field: string, enumValue: T) => {
    const enumFormatted = allowedStatusGeneric(enumValue);
    return `O campo "${field}" deve ser um dos seguintes valores ${enumFormatted}.`;
  },
  uuid: (field: string) => `O campo "${field}" deve ser um uuid.`,
  json: (field: string) => `O campo "${field}" deve ser um json.`,
  document: (field: string, nameDocument: string) =>
    `O campo ${field} deve ser um ${nameDocument} valido.`,
};
