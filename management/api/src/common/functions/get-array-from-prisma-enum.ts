export function getArrayFromPrismaEnum(e: unknown) {
  return Object.keys(e).filter((key) => typeof e[key] !== 'number');
}
