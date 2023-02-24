import {render} from '../render.js';
import FilterView from '../view/filter-view';
import Sortview from '../view/sort-view';
import pointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';
import NoTasksView from '../view/no-tasks-view.js';

export default class Presenter {

  #pointListView = new pointListView();

  /**
   * @type PointsModel
   */
  #pointsModel = null;

  /**
   * @type Point[]
   */
  #points = [];


  /**
   * @param {Object} params
   * @param {PointsModel} params.pointsModel
   */
  constructor({pointsModel}) {
    this.#pointsModel = pointsModel;
  }

  /**
   *
   * @param {Point} point
   */
  #renderPoint(point) {

    const pointCard = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.id),
      offers: this.#pointsModel.getOffersByType(point.type)
    });

    const pointEditor = new PointEditorView({
      point,
      offers: this.#pointsModel.getOffersByType(point.type)
        .map((offer) =>
          ({
            checked: point.offers.includes(offer.id),
            offer
          })),
      destination: this.#pointsModel.getDestinationById(point.id),
      cities: this.#pointsModel.getCitiesNames(),
      isNew: false
    });

    const replaceCardToForm = () => {
      this.#pointListView.element.replaceChild(pointEditor.element, pointCard.element);
    };

    const replaceFormToCard = () => {
      this.#pointListView.element.replaceChild(pointCard.element, pointEditor.element);
    };

    const onEscDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
      }
    };

    pointCard.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscDownHandler, {once: true});
    });

    pointEditor.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscDownHandler);
    });

    pointEditor.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
    });

    pointEditor.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscDownHandler);
    });

    render(pointCard, this.#pointListView.element);
  }

  init() {

    this.#points = [...this.#pointsModel.points];
    render(new FilterView(), document.body.querySelector('.trip-controls__filters'));
    if (this.#points.length === 0) {
      render(new NoTasksView(), document.body.querySelector('.trip-events'));
    }
    else {
      render(new Sortview(), document.body.querySelector('.trip-events'));

      Array.from({length: 3}).forEach((_, i) => this.#renderPoint(this.#points[i]));

      render(this.#pointListView, document.body.querySelector('.trip-events'));
    }
  }
}
