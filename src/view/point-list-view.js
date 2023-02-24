import {createElement} from '../render.js';

function createPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointListView {

  /**
   * @type Element
   */
  #element = null;

  #getTemplate() {
    return createPointListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
