import dayjs from 'dayjs';
import {getRandomItem, getRandomNumber} from '../utils/common.js';
import {pointTypes} from './enums';
import {destinations} from './destinations.js';

/**
 *
 * @param {PointsModel} pointsModel
 * @returns {Point}
 */
export default function getRandomPoint(pointsModel) {

  const date1 = dayjs().add(getRandomNumber(-10, 10), 'day');
  const date2 = dayjs().add(getRandomNumber(-20, 20), 'day');
  const pointType = getRandomItem(pointTypes);
  const typeOffers = pointsModel.getOffersByType(pointType);

  return {
    'basePrice': getRandomNumber(1000, 10000),
    'dateFrom': date1 > date2 ? date2.toISOString() : date1.toISOString(),
    'dateTo': date1 > date2 ? date1.toISOString() : date2.toISOString(),
    'destination': getRandomItem(destinations).id,
    'id': getRandomNumber(1, 28000),
    'offers': typeOffers.length !== 0 ? Array.from({length: getRandomNumber(0, 2)}).map(() => getRandomItem(typeOffers).id) : [],
    'type': pointType
  };
}
