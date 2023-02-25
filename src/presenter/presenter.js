import {render} from '../framework/render.js';
import {updateItem} from '../utils/common.js';

import Sortview from '../view/sort-view';
import pointListView from '../view/point-list-view';
import PointPresenter from './point-presenter';

import NoTasksView from '../view/no-tasks-view.js';

export default class Presenter {

  /**
   * @type Element
   */
  #container = null;

  #pointListView = new pointListView();
  #noTasksView = new NoTasksView();
  #sortView = new Sortview();

  /**
   * @type PointsModel
   */
  #pointsModel = null;

  /**
   * @type Point[]
   */
  #points = [];

  /**
   * @type Map<string, PointPresenter>
   */
  #pointPresenters = new Map();


  /**
   * @param {Object} params
   * @param {Element} params.container
   * @param {PointsModel} params.pointsModel
   */
  constructor({container, pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#container = container;
  }

  /**
   *
   * @param {Point} point
   */
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsModel: this.#pointsModel,
      pointsListContainer: this.#pointListView.element,
      onDataChange: this.#pointChangeHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(this.#noTasksView, this.#container);
  }

  #renderSort() {
    render(this.#sortView, this.#container);
  }

  #renderPoints() {
    render(this.#pointListView, this.#container);

    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderTrip() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPoints();
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#renderTrip();
  }

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
