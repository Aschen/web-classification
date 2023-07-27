/**
 * Select random elements from an array using Fisher-Yates algorithm
 */
export function getRandomElements<T = any>(
  array: Array<T>,
  n: number
): Array<T> {
  const shuffled = array.slice();

  let currentIndex = shuffled.length;

  while (currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled.slice(0, n);
}
