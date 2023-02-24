import AbstractView from '../framework/view/abstract-view.js';

function createNoTasksTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class NoTasksView extends AbstractView {

  get template() {
    return createNoTasksTemplate();
  }

}
