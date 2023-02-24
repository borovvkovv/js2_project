import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

function getOffers(offers, checkedOffers) {
  return offers.map((offer) =>
    checkedOffers.includes(offer.id)
      ? `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
      : ''
  ).join('');
}

function createPointTemplate(point, offers, destination) {
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
        ${getOffers(offers, point.offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div >
  </li >`;
}

export default class PointView extends AbstractView {

  #point;
  #offers;
  #destination;
  #handleRollupBtnClick;

  /**
   * @param {object} param
   * @param {Point} param.point
   * @param {Destination} param.destination
   * @param {Offers[]} param.offers
   */
  constructor({point, destination, offers, onRollupBtnClick}) {
    super();

    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#handleRollupBtnClick = onRollupBtnClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupBtnClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #rollupBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupBtnClick();
  };

}
