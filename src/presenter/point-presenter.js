import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {

  /**
   * @type Point
   */
  #point = null;

  /**
   * @type PointsModel
   */
  #pointsModel = null;

  /**
   * @type Element
   */
  #pointsListContainer = null;

  /**
   * @type PointEditorView
   */
  #pointEditor = null;

  /**
   * @type PointView
   */
  #pointCard = null;

  #mode = Mode.DEFAULT;

  #dataChangeHandler = null;
  #modeChangeHandler = null;

  /**
   * @param {object} params
   * @param {PointsModel} params.pointsModel
   */
  constructor({pointsModel, pointsListContainer, onDataChange, onModeChange}) {
    this.#pointsModel = pointsModel;
    this.#pointsListContainer = pointsListContainer;
    this.#dataChangeHandler = onDataChange;
    this.#modeChangeHandler = onModeChange;
  }

  /**
   *
   * @param {Point} point
   */
  init(point) {
    this.#point = point;

    const prevPointCard = this.#pointCard;
    const prevPointEditor = this.#pointEditor;

    this.#pointCard = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offers: this.#pointsModel.getOffersByType(point.type),
      onRollupBtnClick: this.#cardRollupBtnClickHandler
    });

    this.#pointEditor = new PointEditorView({
      point,
      offers: this.#pointsModel.getOffersByType(point.type)
        .map((offer) =>
          ({
            checked: point.offers.includes(offer.id),
            offer
          })),
      destination: this.#pointsModel.getDestinationById(point.destination),
      cities: this.#pointsModel.getCitiesNames(),
      isNew: false,
      onFormSubmit: this.#formSubmitHandler,
      onRollupBtnClick: this.#formRollupBtnClickHandler
    });

    if (prevPointCard === null || prevPointEditor === null) {
      render(this.#pointCard, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointCard, prevPointCard);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditor, prevPointEditor);
    }

    remove(prevPointCard);
    remove(prevPointEditor);

  }

  destroy() {
    remove(this.#pointCard);
    remove(this.#pointEditor);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditor, this.#pointCard);
    document.addEventListener('keydown', this.#escKeyDownHandler, {once: true});
    this.#modeChangeHandler();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointCard, this.#pointEditor);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard.call(this);
    }
  };

  /**
   * @param {Point} point
   */
  #formSubmitHandler = (point) => {
    this.#replaceFormToCard.call(this);
    this.#dataChangeHandler(point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #cardRollupBtnClickHandler = () => {
    this.#replaceCardToForm.call(this);
  };

  #formRollupBtnClickHandler = () => {
    this.#replaceFormToCard.call(this);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

}
