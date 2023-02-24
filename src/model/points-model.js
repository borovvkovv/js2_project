import getRandomPoint from '../mock/point';
import {offers} from '../mock/offers';
import {destinations} from '../mock/destinations';


export default class PointsModel {

  #offers = offers;
  #destinations = destinations;
  #points = Array.from({length: 10}).map(() => getRandomPoint(this));

  get points() {
    return this.#points;
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type).offers;
  }

  getCitiesNames() {
    return [...new Set(this.#destinations.map((destination) => destination.name))];
  }

}
