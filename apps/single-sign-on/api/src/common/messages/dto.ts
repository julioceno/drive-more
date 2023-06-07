export const dto = {
  required: (field: string) => `O campo "${field}" é obrigatório.`,
  string: (field: string) => `O campo "${field}" é uma string.`,
  number: (field: string) => `O campo "${field}" é um número.`,
  email: (field: string) => `O campo "${field}" é um e-mail.`,
};
