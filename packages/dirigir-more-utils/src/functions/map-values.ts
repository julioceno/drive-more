import { set } from 'lodash';

type ValuesType = Record<string, unknown>;

export function mapValues(values: ValuesType) {
  const mappedObj = {};

  for (const [key, value] of Object.entries(values)) {
    set(mappedObj, key, value);
  }

  return mappedObj;
}
