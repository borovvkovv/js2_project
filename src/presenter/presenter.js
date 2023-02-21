import {render} from '../render.js';
import FilterView from '../view/filter-view';
import Sortview from '../view/sort-view';
import pointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';

export default class Presenter {

  pointListView = new pointListView();

  /**
   * @param {Object} params
   * @param {PointsModel} params.pointsModel
   */
  constructor(params) {
    this.pointsModel = params.pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.points];

    this.typeOffers = this.pointsModel.getOffersByType(this.points[1].type);

    render(new FilterView(), document.body.querySelector('.trip-controls__filters'));
    render(new Sortview(), document.body.querySelector('.trip-events'));
    //render(new NewPointView(), this.pointListView.getElement());

    render(new PointEditorView({
      point: this.points[1],
      offers: this.typeOffers.map((offer) =>
        ({
          checked: this.points[1].offers.includes(offer.id),
          offer
        })),
      destination: this.pointsModel.getDestinationById(this.points[1].id),
      cities: this.pointsModel.destinations.map((destination) => destination.name)
    }), this.pointListView.getElement());

    Array.from({length: 3}).forEach((_, i) => render(new PointView({
      point: this.points[i],
      destination: this.pointsModel.getDestinationById(this.points[i].id),
      offers: this.pointsModel.getOffersByType(this.points[i].type)
    }), this.pointListView.getElement()));

    render(this.pointListView, document.body.querySelector('.trip-events'));
  }
}
