import {pointTypes} from '../mock/enums';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

/**
 * @returns string
 */
function getTypesList() {
  return pointTypes.map((type) =>
    `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`
  ).join('');
}

/**
 *
 * @param {OffersWithCheck[]} offers
 * @returns
 */
function getOffers(offers) {
  return offers.map(({offer, checked}) =>
    `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${offer.id}"
          type="checkbox"
          name="event-offer"
          ${checked && 'checked'}
        >
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('');
}

/**
 *
 * @param {Picture[]} pictures
 * @returns string
 */
function getPhotos(pictures) {
  return pictures.map((picture) =>
    `<img class="event__photo"
        src="${picture.src}"
        alt="${picture.description}"
     >`);
}

/**
 * @param {string[]} cities
 * @returns string
 */
function getCities(cities) {
  return cities.map((city) => `<option value="${city}"></option>`);
}

/**
 * @param {object} param
 * @param {Point} param.point
 * @param {Destination} param.destination
 * @param {OffersWithCheck[]} param.offers
 * @param {boolean} param.isNew
 * @param {string[]} param.cities
 * @returns string
 */
function createPointEditorTemplate({point, destination, offers, isNew, cities}) {
  const {basePrice, dateFrom, dateTo, type} = point;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img
                class="event__type-icon"
                width="17"
                height="17"
                src="img/icons/${type}.png"
                alt="Event type icon"
              >
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${getTypesList()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getCities(cities)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dayjs(dateFrom).format('DD/MM/YY hh:mm')}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dayjs(dateTo).format('DD/MM/YY hh:mm')}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${basePrice}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${isNew
    ? '<button class="event__reset-btn" type="reset">Cancel</button>'
    : `<button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`}

        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${getOffers(offers)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            ${isNew ? `
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${getPhotos(destination.pictures)}
                </div>
              </div>` : ''}

          </section>
        </section>
      </form>
    </li>`;
}

export default class PointEditorView extends AbstractView {

  #point;
  #destination;
  #offers;
  #cities;
  #isNew;
  #handleFormSubmit;
  #handleRollupBtnClick;

  /**
   * @param {Object} param
   * @param {Point} param.point
   * @param {OffersWithCheck[]} param.offers
   * @param {Destination} param.destination
   * @param {string[]} param.cities
   * @param {boolean} param.isNew
   */
  constructor({point, offers, destination, cities, isNew, onFormSubmit, onRollupBtnClick}) {
    super();

    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#cities = cities;
    this.#isNew = isNew;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupBtnClick = onRollupBtnClick;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupBtnClickHandler);
  }

  get template() {
    return createPointEditorTemplate({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      isNew: this.#isNew,
      cities: this.#cities
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #rollupBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupBtnClick();
  };

}
