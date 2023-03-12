import {SortType} from '../const';

/**
 * @type {Record<string, SortCallback>}
 */
export const sort = {
  [SortType.DEFAULT]: (point1, point2) => Date.parse(point1.startDate) - Date.parse(point2.endDate),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points,
  [SortType.PRICE]: (point1, point2) => point2.basePrice - point1.basePrice,
  [SortType.OFFERS]: (points) => points
};
