import AbstractView from '../framework/view/abstract-view.js';

function getFilters(filterNames, currentSortType) {
  return filterNames.map((name) =>
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input
        id="sort-${name}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${name}"
        ${currentSortType === name ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-${name}" data-sort-type="${name}">${name}</label>
    </div>`
  ).join('');
}

function createSortTemplate(filterNames, currentSortType) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${getFilters(filterNames, currentSortType)}
    </form>`;
}

export default class SortView extends AbstractView {

  #filterNames;
  #sortTypeChangeHandler;
  #currentSortType;

  /**
   * @param {Object} params
   * @param {string[]} params.filterNames
   * @param {string} params.currentSortType
   * @param {OnSortTypeChangeHandler} params.onSortTypeChange
   */
  constructor({filterNames, currentSortType, onSortTypeChange}) {
    super();

    this.#sortTypeChangeHandler = onSortTypeChange;
    this.#currentSortType = currentSortType;
    this.#filterNames = filterNames;

    this.element.addEventListener('click', this.#handleClick, {capture: true});
  }

  get template() {
    return createSortTemplate(this.#filterNames, this.#currentSortType);
  }

  #handleClick = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    this.#sortTypeChangeHandler(evt.target.dataset.sortType);
  };

}
