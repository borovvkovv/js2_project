import {createElement} from '../render.js';

function createNoTasksTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class NoTasksView {

  /**
   * @type Element
   */
  #element = null;

  #getTemplate() {
    return createNoTasksTemplate();
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
