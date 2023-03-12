import AbstractView from '../framework/view/abstract-view.js';

/**
 *
 * @param {FilterState[]} filtersStates
 * @param {string} currentFilter
 */
function getFilters(filtersStates, currentFilter)
{
  return filtersStates.map((filterState,) =>
    `<div class="trip-filters__filter">
      <input
        id="filter-${filterState.filterName}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterState.filterType}"
        ${filterState.isAnyPoints ? '' : 'disabled'}
        ${filterState.filterType === currentFilter ? 'checked' : ''}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${filterState.filterName}"
      >
        ${filterState.filterName}
      </label>
    </div>`
  ).join('');
}

function createFilterTemplate(filtersStates, currentFilter) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${getFilters(filtersStates, currentFilter)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {

  #filtersStates;
  #changeHandler;
  #currentFilter;

  /**
   * @constructor
   * @param {Object} params
   * @param {FilterState[]} params.filtersStates
   * @param {string} params.currentFilter
   * @param {onFilterChangeHandler} params.onChange
   */
  constructor({filtersStates, currentFilter, onChange}) {
    super();

    this.#filtersStates = filtersStates;
    this.#currentFilter = currentFilter;
    this.#changeHandler = onChange;

    this.element.querySelectorAll('input').forEach((element) => element.addEventListener('change', this.#handleChange));
  }

  get template() {
    return createFilterTemplate(this.#filtersStates, this.#currentFilter);
  }

  #handleChange = (evt) => {
    this.#changeHandler(evt.target.value);
  };

}
