import Observable from '../framework/observable';
import {UpdateType} from '../const';
import { pointTypes } from '../const';

export default class PointsModel extends Observable {
  /** @type {Point[]} */
  #points = [];

  /** @type {OffersByType[]} */
  #offers = [];

  /** @type {Destination[]} */
  #destinations = [];

  /** @type {PointsApiService} */
  #pointsApiService = null;

  /**
   * @param {object} params
   * @param {PointsApiService} params.pointsApiService
   */
  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get pointTypes() {
    return pointTypes;
  }

  get destinations() {
    return this.#destinations;
  }

  async update(updateType, update) {
    const index = this.#points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      const response = await this.#pointsApiService.update(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.splice(index + 1)
      ];
      this._notify(updateType, update);
    }
    catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async add(updateType, update) {
    try {
      const response = await this.#pointsApiService.add(update);
      const addedPoint = this.#adaptToClient(response);
      this.#points = [
        addedPoint,
        ...this.#points
      ];

      this._notify(updateType, addedPoint);
    }
    catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async delete(updateType, update) {

    const index = this.#points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.delete(update);
    }
    catch(err) {
      throw new Error('Can\'t delete point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.splice(index + 1)
    ];
    this._notify(updateType);
  }

  async init() {
    try {
      /** @type {ServerPoint[]} */
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    }
    catch(err) {
      this.#points = [];
    }

    try {
      this.#destinations = await this.#pointsApiService.destinations;
    }
    catch(err) {
      this.#destinations = [];
    }

    try {
      this.#offers = await this.#pointsApiService.offers;
    }
    catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type).offers;
  }

  getCitiesNames() {
    return this.#destinations.map((destination) => destination.name);
  }

  /**
   * @param {ServerPoint} point
   * @returns {Point}
   */
  #adaptToClient(point) {
    const adaptedPoint = {
      basePrice: point['base_price'],
      startDate: point['date_from'],
      endDate: point['date_to'],
      destinationId: point['destination'],
      id: point['id'],
      offerIds: point['offers'],
      type: point['type']
    };

    return adaptedPoint;
  }

}
