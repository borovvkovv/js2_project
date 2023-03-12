import {filter} from '../utils/filter.js';

/**
 * @param {Point[]} points
 * @return {FilterState[]}
 */
export const generateFilters = (points) =>
  Object.entries(filter).map(
    ([filterName, filterCallback]) => ({
      filterName: filterName,
      isAnyPoints: points.filter(filterCallback).length > 0
    }));
