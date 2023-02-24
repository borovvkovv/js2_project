import {createElement} from '../render.js';

/**
 *
 * @returns string
 */
function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView {

  /**
   * @type Element
   */
  #element = null;

  #getTemplate() {
    return createNewPointButtonTemplate();
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
