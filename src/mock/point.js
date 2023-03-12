import dayjs from 'dayjs';
import {getRandomItem, getRandomNumber} from '../utils/common.js';
import {pointTypes} from './enums';
import {destinations} from './destinations.js';


export default (function getRandomPoint() {
  let date1 = dayjs().add(-5, 'day');
  let date2 = dayjs().add(-5, 'day').add(2, 'hour');
  return (pointsModel) => {
    date1 = date1.add(1, 'day');
    date2 = date2.add(1, 'day');
    const pointType = getRandomItem(pointTypes);
    const typeOffers = pointsModel.getOffersByType(pointType);

    return {
      'basePrice': getRandomNumber(1000, 10000),
      'dateFrom': date1.toISOString(),
      'dateTo': date2.toISOString(),
      'destination': getRandomItem(destinations).id,
      'id': getRandomNumber(1, 28000),
      'offers': typeOffers.length !== 0 ? Array.from({length: getRandomNumber(0, 2)}).map(() => getRandomItem(typeOffers).id) : [],
      'type': pointType
    };
  };
})();
