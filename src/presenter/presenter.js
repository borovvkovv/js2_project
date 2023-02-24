import {render, replace} from '../framework/render.js';
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

    const onEscDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard.call(this);
      }
    };

    const pointCard = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.id),
      offers: this.#pointsModel.getOffersByType(point.type),
      onRollupBtnClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', onEscDownHandler, {once: true});
      }
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
      isNew: false,
      onFormSubmit: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', onEscDownHandler);
      },
      onRollupBtnClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', onEscDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditor, pointCard);
    }

    function replaceFormToCard() {
      replace(pointCard, pointEditor);
    }

    render(pointCard, this.#pointListView.element);
  }

  init() {

    this.#points = [...this.#pointsModel.points];

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
