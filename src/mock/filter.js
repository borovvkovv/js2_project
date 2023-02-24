import {filter} from '../utils/filter.js';

/**
 * @param {Point[]} points
 * @return {filterState[]}
 */
export const generateFilters = (points) =>
  Object.entries(filter).map(
    ([filterName, filteredPoints]) => ({
      name: filterName,
      isAnyPoints: filteredPoints(points).length > 0
    }));
