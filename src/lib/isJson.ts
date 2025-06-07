export function isValidJson(data: string | string[]) {
  try {
    return typeof data === `string` ? JSON.parse(data) : data;
  } catch (error) {
    return data;
  }
}
