export function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export function getRandomItem(array) {
  const maxIndex = array.length - 1;

  return array[getRandomNumber(0, maxIndex)];
}

export function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}
