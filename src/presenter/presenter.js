import {remove, render, RenderPosition} from '../framework/render.js';

import Sortview from '../view/sort-view';
import pointListView from '../view/point-list-view';
import PointPresenter from './point-presenter';

import NoTasksView from '../view/no-tasks-view.js';
import {FilterType, SortType} from '../const.js';
import {sort} from '../utils/sort.js';
import {UserAction, UpdateType} from '../const';
import {filter} from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class Presenter {

  #pointsContainer;
  #sortContainer;

  #pointsModel;
  #filterModel;

  #pointListView = new pointListView();
  #noTasksView;
  #sortView = null;

  /** @type Map<string, PointPresenter> */
  #pointPresenters = new Map();

  /**@type {NewPointPresenter} */
  #newPointPresenter;

  /** @type string */
  #currentSortType = SortType.DEFAULT;

  #loadingView = new LoadingView();
  #isLoading = true;

  /**
   * @param {Object} params
   * @param {HTMLElement} params.pointsContainer
   * @param {HTMLElement} params.sortContainer
   * @param {PointsModel} params.pointsModel
   * @param {FilterModel} params.filterModel
   * @param {OnNewPointDestroy} params.onNewPointDestroy
   */
  constructor({pointsContainer, sortContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#pointsContainer = pointsContainer;
    this.#sortContainer = sortContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      pointsContainer: this.#pointListView.element,
      pointsModel: this.#pointsModel,
      onChange: this.#handleViewAction,
      onDestroy: () => {
        onNewPointDestroy();
        if (this.#pointsModel.points.length === 0) {
          this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
        }
      }
    });
  }

  init() {
    // this.#points = [...this.#pointsModel.points];

    this.#renderTrip();
  }

  get points() {
    return [...this.#pointsModel.points]
      .filter(filter[this.#filterModel.filter])
      .sort(sort[this.#currentSortType]);
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;

    if (this.#pointsModel.points.length !== 0) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
    }
    else {
      this.#clearTrip();
      this.#renderTrip({
        renderPointsList: true
      });
    }
    this.#newPointPresenter.init();
  }

  /** @param {Point} point */
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      pointsModel: this.#pointsModel,
      pointsListContainer: this.#pointListView.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(String(point.id), pointPresenter);
  }

  #renderNoPoints() {
    this.#noTasksView = new NoTasksView(this.#filterModel.filter);
    render(this.#noTasksView, this.#pointsContainer);
  }

  #renderLoading() {
    render(this.#loadingView, this.#pointsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTrip({renderPointsList = false} = {}) {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (renderPointsList) {
      //renderSort
      this.#sortView = new Sortview({
        filterNames: Object.entries(SortType).map(([, value]) => value),
        currentSortType: this.#currentSortType,
        onSortTypeChange: this.#sortTypeChangeHandler
      });
      render(this.#sortView, this.#sortContainer);
      render(this.#pointListView, this.#pointsContainer);
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    //renderSort
    this.#sortView = new Sortview({
      filterNames: Object.entries(SortType).map(([, value]) => value),
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });
    render(this.#sortView, this.#sortContainer);

    //renderPoints
    render(this.#pointListView, this.#pointsContainer);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();

    remove(this.#sortView);
    this.#sortView = null;

    if (this.#noTasksView) {
      remove(this.#noTasksView);
    }

    remove(this.#loadingView);

    //clearPoints
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if(resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  /**
   * @param {string} actionType
   * @param {string} updateType
   * @param {Point} update
   */
  #handleViewAction = async (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(String(update.id)).setDeleting();
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(String(update.id)).setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(String(update.id)).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(String(update.id)).setAborting();
        }
        break;
    }
  };

  /**
   * @param {string} updateType
   * @param {Point} data
   */
  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(String(data.id)).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingView);
        this.#renderTrip();
        break;
    }
  };
}
