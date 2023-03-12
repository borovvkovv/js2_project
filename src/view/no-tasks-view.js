import AbstractView from '../framework/view/abstract-view.js';
import {FilterTypeNoPointsMap} from '../maps.js';

function createNoTasksTemplate(currentFilter) {
  return `<p class="trip-events__msg">${FilterTypeNoPointsMap[currentFilter]}</p>`;
}

export default class NoTasksView extends AbstractView {
  #currentFilter;

  constructor(currentFilter) {
    super();

    this.#currentFilter = currentFilter;
  }

  get template() {
    return createNoTasksTemplate(this.#currentFilter);
  }

}
