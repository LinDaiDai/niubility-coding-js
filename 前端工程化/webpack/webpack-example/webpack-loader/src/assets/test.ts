export function numToWord(num: number): string {
  return config[num]
}

const config = {
  1: 'one',
  2: 'two'
}
