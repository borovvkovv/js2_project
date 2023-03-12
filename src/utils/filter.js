import {FilterType} from '../const';

/**
 * @type {Record<string, FilterCallback>}
 */
export const filter = {
  [FilterType.DEFAULT]: () => true,
  [FilterType.FUTURE]: (point) => Date.parse(point.endDate) > Date.now()
};
