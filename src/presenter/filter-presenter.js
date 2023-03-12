import {UpdateType} from '../const';
import {render, replace} from '../framework/render';
import {filter} from '../utils/filter';
import FilterView from '../view/filter-view';

export default class FilterPresenter {

  /**@type {HTMLElement} */
  #filterContainer;

  /**@type {FilterModel} */
  #filterModel;

  /**@type {PointsModel} */
  #pointsModel;

  /**@type {FilterView} */
  #filterView = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  /**@returns {FilterState[]} */
  get filters() {
    const points = this.#pointsModel.points;

    return Object.entries(filter).map(
      ([filterType, filterCallback]) => ({
        filterType,
        filterName: filterType.toUpperCase(),
        isAnyPoints: points.filter(filterCallback).length > 0
      }));
  }

  init() {
    const prevFilterComponent = this.#filterView;

    this.#filterView = new FilterView({
      filtersStates: this.filters,
      currentFilter: this.#filterModel.filter,
      onChange: this.#handleChange
    });

    if (!prevFilterComponent) {
      render(this.#filterView, this.#filterContainer);
      return;
    }
    replace(this.#filterView, prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
