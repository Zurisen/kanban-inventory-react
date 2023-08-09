export function getRandomInt() {
  const max = 10000;
  const min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
