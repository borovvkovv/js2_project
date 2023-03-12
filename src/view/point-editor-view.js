import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import createCalendar from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {convertDateToString, convertStringToDate} from '../utils/common';

/**
 * @returns string
 */
function getTypesList(pointTypes, isDisabled) {
  return pointTypes.map((type) =>
    `<div class="event__type-item">
        <input
          id="event-type-${type}-1"
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${isDisabled && 'disabled'}
        >
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`
  ).join('');
}

/**
 * @param {OffersWithCheck[]} offers
 * @returns
 */
function getOffers(offers, isDisabled) {
  return offers.map(({offer, checked}) =>
    `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="${offer.id}"
          type="checkbox"
          name="event-offer"
          ${checked && 'checked'}
          ${isDisabled && 'disabled'}
        >
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('');
}

/**
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
 * @param {object} params
 * @param {PointViewState} params.point
 * @param {boolean} params.isNew
 * @param {string[]} params.cityNames
 * @param {string[]} params.pointTypes
 * @returns {string}
 */
function createPointEditorTemplate({point, isNew, cityNames, pointTypes}) {
  const {basePrice, type, offers, destination, isDisabled, isSaving, isDeleting} = point;

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
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
              ${isDisabled && 'disabled'}
            >

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${getTypesList(pointTypes, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destination.name}"
              list="destination-list-1"
              ${isDisabled && 'disabled'}
            >
            <datalist id="destination-list-1">
              ${getCities(cityNames)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label
              class="visually-hidden"
              for="event-start-time-1"
            >
              From
            </label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              ${isDisabled && 'disabled'}
            >
            &mdash;
            <label
              class="visually-hidden"
              for="event-end-time-1"
            >
              To
            </label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              ${isDisabled && 'disabled'}
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
              ${isDisabled && 'disabled'}
            >
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isDisabled && 'disabled'}
          >
            ${isSaving ? 'saving...' : 'save'}
          </button>
          ${isNew
    ? `<button
        class="event__reset-btn"
        type="reset"
        ${isDisabled && 'disabled'}
      >
        Cancel
      </button>`
    : `<button
        class="event__reset-btn"
        type="reset"
        ${isDisabled && 'disabled'}
      >
        ${isDeleting ? 'deleting...' : 'delete'}
      </button>
      <button
        class="event__rollup-btn"
        type="button"
        ${isDisabled && 'disabled'}
      >
        <span class="visually-hidden">Open event</span>
      </button>`}

        </header>
        <section class="event__details">
          ${offers.length === 0 ? '' : `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${getOffers(offers, isDisabled)}
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
  #pointTypes;
  #submitHandler;
  #clickHandler;
  #resetHandler;

  /** @type Calendar */
  #datepickerStart = null;

  /** @type Calendar */
  #datepickerEnd = null;

  /**
   * @param {Object} param
   * @param {Point | Omit<Point, 'id'> } param.point
   * @param {string[]} param.cityNames
   * @param {boolean} param.isNew
   * @param {Destination[]} param.destinations
   * @param {OffersByType[]} param.offers
   * @param {string[]} param.pointTypes
   * @param {OnSubmitHandler} param.onSubmit
   * @param {OnClickHandler} param.onClick
   * @param {OnDeleteHandler} param.onReset
   */
  constructor({point, cityNames, isNew, destinations, offers, pointTypes, onSubmit, onClick, onReset}) {
    super();

    this.#offersByType = offers.find((item) => item.type === point.type).offers;

    this.#destination = destinations.find((item) => item.id === point.destinationId);
    this._setState(PointEditorView.parsePointToState(point, this.#destination, this.#offersByType));
    this.#cityNames = cityNames;
    this.#isNew = isNew;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointTypes = pointTypes;
    this.#submitHandler = onSubmit;
    this.#clickHandler = onClick;
    this.#resetHandler = onReset;

    this._restoreHandlers();
  }

  get template() {

    return createPointEditorTemplate({
      point: this._state,
      isNew: this.#isNew,
      cityNames: this.#cityNames,
      pointTypes: this.#pointTypes
    });

  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#handleSubmit);
    this.element.addEventListener('click', this.#handleClick);
    this.element.querySelectorAll('.event__type-input').forEach((e) => e.addEventListener('change', this.#pointTypeChangeHandler));
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#handleDestinationChange);
    this.element.querySelector('form').addEventListener('reset', this.#handleReset);

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
        checked: point.offerIds.includes(offerByType.id)
      })),
      dateFrom: dayjs(point.startDate).valueOf(),
      dateTo: dayjs(point.endDate).valueOf(),
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  /**
   * @param {PointViewState} state
   * @returns {Point}
   */
  static parseStateToPoint(state) {
    const point = { ...state,
      destinationId: state.destination.id,
      offerIds: state.offers.filter((offer) => offer.checked).map((offer) => offer.offer.id),
      startDate: state.dateFrom,
      endDate: state.dateTo
    };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  #setDatepicker() {
    this.#datepickerStart = createCalendar(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        monthSelectorType: 'static',
        // static: true,
        dateFormat: 'd/m/y H:i',
        locale: {firstDayOfWeek: 1},
        'time_24hr': true,
        onChange: ([value]) => {
          this.#datepickerEnd.set('minDate', value);
          this._setState({
            dateFrom: value
          });
        }
      }
    );

    this.#datepickerEnd = createCalendar(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        monthSelectorType: 'static',
        // static: true,
        dateFormat: 'd/m/y H:i',
        locale: {firstDayOfWeek: 1},
        'time_24hr': true,
        onChange: ([value]) => {
          this.#datepickerStart.set('maxDate', value);
          this._setState({
            dateTo: value
          });
        }
      }
    );

    this.#datepickerStart.setDate(this._state.dateFrom);
    this.#datepickerEnd.setDate(this._state.dateTo);
  }

  /** @param {SubmitEvent} evt */
  #handleSubmit = (evt) => {
    evt.preventDefault();

    //@ts-ignore
    const checkedOfferIds = [...this.element.querySelectorAll('.event__offer-checkbox:checked')].map((element) => Number(element.id));

    this._setState({...this._state,
      // @ts-ignore
      basePrice: Number.parseInt(this.element.querySelector('#event-price-1').value, 10),
      // @ts-ignore
      dateFrom: this.#datepickerStart.selectedDates[0],
      // @ts-ignore
      dateTo: this.#datepickerEnd.selectedDates[0],
      // @ts-ignore
      destination: this.#destinations.find((d) => d.name === this.element.querySelector('#event-destination-1').value),
      offers: this._state.offers.map((offer) =>
        ({
          offer: offer.offer,
          checked: checkedOfferIds.includes(offer.offer.id)
        }))
    });
    this.#submitHandler(PointEditorView.parseStateToPoint(this._state));

  };

  /** @param {MouseEvent & {target: Element}} evt */
  #handleClick = (evt) => {
    if (evt.target.closest('.event__rollup-btn')) {
      // evt.preventDefault();
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

  /** @param {KeyboardEvent} evt */
  #keyDownHandler = (evt) => {
    if (evt.key === 'Escape' && (this.#datepickerStart.isOpen || this.#datepickerEnd.isOpen)) {
      evt.stopPropagation();

      this.#datepickerStart.close();
      this.#datepickerEnd.close();
    }
  };

  /** @param {InputEvent & {target: HTMLInputElement}} evt */
  #handleDestinationChange = (evt) => {
    evt.preventDefault();

    this.updateElement({...this._state,
      destination: this.#destinations.find((item) => item.name === evt.target.value)
    });
  };

  #handleReset = (evt) => {
    if (this.#isNew) {
      evt.preventDefault();
      this.#resetHandler();
    } else {
      evt.preventDefault();
      this.#resetHandler(PointEditorView.parseStateToPoint(this._state));
    }
  };

}
