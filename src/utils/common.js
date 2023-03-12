export function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export function getRandomItem(array) {
  const maxIndex = array.length - 1;

  return array[getRandomNumber(0, maxIndex)];
}

export function convertDateToString(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const dateExceptTimeZone = date.getTime() - timezoneOffset;
  return new Date(dateExceptTimeZone).toISOString();
}

export function convertStringToDate(dateString) {
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const dateExceptTimeZone = date.getTime() + userTimezoneOffset;
  return new Date(dateExceptTimeZone);
}
