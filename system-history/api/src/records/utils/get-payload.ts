export function getPayload(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
