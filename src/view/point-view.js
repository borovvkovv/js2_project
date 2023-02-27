import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

/**
 * @param {Offer[]} offersByType
 * @param {number[]} pointOfferIds
 * @returns {string}
 */
function getOffers(offersByType, pointOfferIds) {
  return offersByType.map((offer) =>
    pointOfferIds.includes(offer.id)
      ? `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
      : ''
  ).join('');
}

/**
 * @param {Point} point
 * @param {Offer[]} offersByType
 * @param {Destination} destination
 * @returns {string}
 */
function createPointTemplate(point, offersByType, destination) {
  const {basePrice, dateFrom, dateTo, type} = point;

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${dayjs(dateFrom).format('YYYY-MM-DD')}>${dayjs(dateFrom).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(dateFrom).format('YYYY-MM-DDThh:mm')}">${dayjs(dateFrom).format('hh:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(dateTo).format('YYYY-MM-DDThh:mm')}">${dayjs(dateTo).format('hh:mm')}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffers(offersByType, point.offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div >
  </li >`;
}

export default class PointView extends AbstractView {

  #point;
  #offersByType;
  #destination;
  #clickHandler;

  /**
   * @param {object} param
   * @param {Point} param.point
   * @param {Destination} param.destination
   * @param {Offer[]} param.offersByType
   * @param {OnClickHandler} param.onClick
   */
  constructor({point, destination, offersByType, onClick}) {
    super();

    this.#point = point;
    this.#destination = destination;
    this.#offersByType = offersByType;
    this.#clickHandler = onClick;

    this.element.addEventListener('click', this.#handleClick);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offersByType, this.#destination);
  }

  /**
   * @param {MouseEvent & {target: Element}} evt
   */
  #handleClick = (evt) => {
    evt.preventDefault();

    if (evt.target.closest('.event__rollup-btn')) {
      this.#clickHandler();
    }
  };

}
