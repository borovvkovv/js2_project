import AbstractView from '../framework/view/abstract-view.js';

/**
 *
 * @param {filterState[]} filtersStates
 */
function getFilters(filtersStates)
{
  return filtersStates.map((filterState) =>
    `<div class="trip-filters__filter">
      <input
        id="filter-${filterState.name}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterState.name}"
        ${filterState.isAnyPoints ? '' : 'disabled'}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${filterState.name}"
      >
        ${filterState.name}
      </label>
    </div>`
  ).join('');
}

function createFilterTemplate(filtersStates) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${getFilters(filtersStates)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {

  #filtersStates;

  /**
   * @constructor
   * @param {filterState[]} filtersStates
   */
  constructor(filtersStates) {
    super();

    this.#filtersStates = filtersStates;
  }

  get template() {
    return createFilterTemplate(this.#filtersStates);
  }

}
