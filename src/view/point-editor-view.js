import {pointTypes} from '../mock/enums';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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
          id="${offer.id}"
          type="checkbox"
          name="event-offer"
          ${checked && 'checked'}
        >
        <label class="event__offer-label" for="${offer.id}">
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
 * @param {PointViewState} param.point
 * @param {boolean} param.isNew
 * @param {string[]} param.cityNames
 * @returns string
 */
function createPointEditorTemplate({point, isNew, cityNames}) {
  const {basePrice, dateFrom, dateTo, type, offers, destination} = point;

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
            <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getCities(cityNames)}
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
          ${offers.length === 0 ? '' : `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${getOffers(offers)}
            </div>
          </section>`}

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

export default class PointEditorView extends AbstractStatefulView {

  #cityNames;
  #isNew;
  #destination;
  #destinations;
  #offers;
  #offersByType;
  #submitHandler;
  #clickHandler;

  /**
   * @type Calendar
   */
  #datepickerStart = null;

  /**
   * @type Calendar
   */
  #datepickerEnd = null;

  /**
   * @param {Object} param
   * @param {Point} param.point
   * @param {Destination} param.destination
   * @param {string[]} param.cityNames
   * @param {boolean} param.isNew
   * @param {Destination[]} param.destinations
   * @param {OffersByType[]} param.offers
   * @param {OnSubmitHandler} param.onSubmit
   * @param {OnClickHandler} param.onClick
   */
  constructor({point, destination, cityNames, isNew, destinations, offers, onSubmit, onClick}) {
    super();

    this.#offersByType = offers.find((item) => item.type === point.type).offers;

    this._setState(PointEditorView.parsePointToState(point, destination, this.#offersByType));
    this.#cityNames = cityNames;
    this.#isNew = isNew;
    this.#destination = destination;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#submitHandler = onSubmit;
    this.#clickHandler = onClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditorTemplate({
      point: this._state,
      isNew: this.#isNew,
      cityNames: this.#cityNames
    });
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#handleSubmit);
    this.element.addEventListener('click', this.#handleClick);
    this.element.querySelectorAll('.event__type-input').forEach((e) => e.addEventListener('change', this.#pointTypeChangeHandler));

    this.#setDatepicker();

    this.element.addEventListener('keydown', this.#keyDownHandler, true);
  }

  /**
   * @param {Point} point
   */
  reset(point, destination, offersByType) {
    this.updateElement(PointEditorView.parsePointToState(point, destination, offersByType));
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  /**
   * @param {Point} point
   * @param {Destination} destination
   * @param {Offer[]} offersByType
   * @returns {PointViewState}
   */
  static parsePointToState(point, destination, offersByType) {
    return { ...point,
      destination,
      offers: offersByType.map((offerByType) => ({
        offer: offerByType,
        checked: point.offers.includes(offerByType.id)
      }))
    };
  }

  /**
   * @param {PointViewState} state
   * @returns {Point}
   */
  static parseStateToPoint(state) {
    return { ...state,
      destination: state.destination.id,
      offers: state.offers.filter((offer) => offer.checked).map((offer) => offer.offer.id)
    };
  }

  #setDatepicker() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        monthSelectorType: 'static',
        static: true,
        dateFormat: 'd/m/y H:i',
        locale: {firstDayOfWeek: 1},
        'time_24hr': true,
        onChange: ([value]) => this.#datepickerEnd.set('minDate', value)
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        monthSelectorType: 'static',
        static: true,
        dateFormat: 'd/m/y H:i',
        locale: {firstDayOfWeek: 1},
        'time_24hr': true,
        onChange: ([value]) => this.#datepickerStart.set('maxDate', value)
      }
    );
  }

  /** @param {SubmitEvent} evt */
  #handleSubmit = (evt) => {
    evt.preventDefault();

    //@ts-ignore
    const checkedOfferIds = [this.element.querySelectorAll('.event__offer-checkbox:checked')].map((element) => Number(element.id));

    this._setState({...this._state,
      // @ts-ignore
      basePrice: Number.parseInt(this.element.querySelector('#event-price-1').value, 10),
      // @ts-ignore
      dateFrom: Date.parse(this.element.querySelector('#event-start-time-1').value),
      // @ts-ignore
      dateTo: Date.parse(this.element.querySelector('#event-end-time-1').value),
      // @ts-ignore
      destination: this.#destinations.find((d) => d.name === this.element.querySelector('#event-destination-1').value).id,
      offers: this._state.offers.map((offer) => offer.checked === checkedOfferIds.includes(offer.offer.id))
    });

    this.#submitHandler(PointEditorView.parseStateToPoint(this._state));
  };

  /** @param {MouseEvent & {target: Element}} evt */
  #handleClick = (evt) => {
    if (evt.target.closest('.event__rollup-btn')) {
      evt.preventDefault();
      this.#clickHandler();
    }
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    //@ts-ignore
    const newPointType = this.element.querySelector('.event__type-input:checked').value;
    const offersByType = this.#offers.find((item) => item.type === newPointType).offers;

    this.updateElement({
      type: newPointType,
      offers: offersByType.map((offerByType) => ({
        offer: offerByType,
        checked: false
      }))
    });
  };

  /**
   *
   * @param {KeyboardEvent} evt
   */
  #keyDownHandler = (evt) => {
    if (evt.key === 'Escape' && (this.#datepickerStart.isOpen || this.#datepickerEnd.isOpen)) {
      evt.stopPropagation();

      this.#datepickerStart.close();
      this.#datepickerEnd.close();
    }
  };

}
