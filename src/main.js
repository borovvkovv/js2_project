import Presenter from './presenter/presenter';
import PointsModel from './model/points-model';
import {render} from './framework/render.js';
import FilterView from './view/filter-view';
import {generateFilters} from './mock/filter';

const pointsModel = new PointsModel();

const test = generateFilters(pointsModel.points);
render(new FilterView(test), document.body.querySelector('.trip-controls__filters'));

const presenter = new Presenter({pointsModel});

presenter.init();
