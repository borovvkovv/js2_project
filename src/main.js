import Presenter from './presenter/presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view';
import {render} from './framework/render';
import PointsApiService from './points-api-service';

const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';
const AUTHORIZATION = 'Basic gtfhxbdftghbzdfz';
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

/**@type {HTMLElement} */
const pointsContainer = document.body.querySelector('.trip-events');

/**@type {HTMLElement} */
const filterContainer = document.querySelector('.trip-controls__filters');

/**@type {HTMLElement} */
const sortContainer = document.querySelector('.trip-events');

/**@type {HTMLElement} */
const newPointButtonContainer = document.querySelector('.trip-main');

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

const presenter = new Presenter({
  pointsContainer,
  sortContainer,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButtonView = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

filterPresenter.init();
presenter.init();
pointsModel
  .init()
  .finally(() => render(newPointButtonView, newPointButtonContainer));

function handleNewPointFormClose() {
  //@ts-ignore
  newPointButtonView.element.disabled = false;
}

function handleNewPointButtonClick() {
  presenter.createPoint();

  //@ts-ignore
  newPointButtonView.element.disabled = true;
}
