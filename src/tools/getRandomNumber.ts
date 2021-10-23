export function generateRandomNumber(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper + 1 - lower)) + lower;
}
