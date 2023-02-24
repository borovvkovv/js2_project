import dayjs from 'dayjs';
import {FilterType} from '../const';

/**
 * @type {Record<string, FilterCallback}
 */
export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateTo) > Date.now())
};
