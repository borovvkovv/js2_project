import {render} from '../render.js';
import FilterView from '../view/filter-view';
import Sortview from '../view/sort-view';
import pointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import NewPointView from '../view/new-point-view';
import PointEditorView from '../view/point-editor-view';

export default class Presenter {

  pointListView = new pointListView();

  init() {
    render(new FilterView(), document.body.querySelector('.trip-controls__filters'));
    render(new Sortview(), document.body.querySelector('.trip-events'));
    render(new NewPointView(), this.pointListView.getElement());
    render(new PointEditorView(), this.pointListView.getElement());
    Array.from({length: 3}).forEach(() => render(new PointView(), this.pointListView.getElement()));
    render(this.pointListView, document.body.querySelector('.trip-events'));
  }
}
