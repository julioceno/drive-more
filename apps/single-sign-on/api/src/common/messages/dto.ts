export const dto = {
  required: (field: string) => `O campo "${field}" é obrigatório.`,
  string: (field: string) => `O campo "${field}" deve ser uma string.`,
  number: (field: string) => `O campo "${field}" deve ser um número.`,
  email: (field: string) => `O campo "${field}" deve ser um e-mail.`,
  object: (field: string) => `O campo "${field}" deve ser um objeto.`,
  enum: (field: string) => `O campo "${field}" deve ser um enum.`,
  uuid: (field: string) => `O campo "${field}" deve ser um uuid.`,
};
