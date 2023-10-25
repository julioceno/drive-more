import { readFileSync } from 'fs';
import { resolve } from 'path';

export function requireAsPlainTextConstructor(filePath: string) {
  const filename = resolve(filePath);
  return readFileSync(filename, 'utf8');
}
