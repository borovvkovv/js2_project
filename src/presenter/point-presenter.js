import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {

  /** @type {Point} */
  #point;

  #pointsModel;
  #pointsListContainer;

  /**
   * @type PointEditorView
   */
  #pointEditor = null;

  /**
   * @type PointView
   */
  #pointCard = null;

  #mode = Mode.DEFAULT;

  #dataChangeHandler;
  #modeChangeHandler;

  /**
   * @param {object} params
   * @param {Point} params.point
   * @param {PointsModel} params.pointsModel
   * @param {HTMLElement} params.pointsListContainer
   * @param {OnDataChangeHandler} params.onDataChange
   * @param {OnModeChangeHandler} params.onModeChange
   */
  constructor({pointsModel, pointsListContainer, onDataChange, onModeChange}) {
    this.#pointsModel = pointsModel;
    this.#pointsListContainer = pointsListContainer;
    this.#dataChangeHandler = onDataChange;
    this.#modeChangeHandler = onModeChange;
  }

  /** @param {Point} point */
  init(point) {
    this.#point = point;

    const prevPointCard = this.#pointCard;
    const prevPointEditor = this.#pointEditor;

    this.#pointCard = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offersByType: this.#pointsModel.getOffersByType(point.type),
      onClick: this.#handlePointCardClick
    });

    this.#pointEditor = new PointEditorView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      cityNames: this.#pointsModel.getCitiesNames(),
      isNew: false,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      onSubmit: this.#handlePointEditorSubmit,
      onClick: this.#handlePointEditorClick
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
      this.#pointEditor.reset(this.#point, this.#pointsModel.getDestinationById(this.#point.destination), this.#pointsModel.offers.find((item) => item.type === this.#point.type).offers);
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
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    replace(this.#pointCard, this.#pointEditor);
    this.#mode = Mode.DEFAULT;

  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditor.reset(this.#point, this.#pointsModel.getDestinationById(this.#point.destination), this.#pointsModel.offers.find((item) => item.type === this.#point.type).offers);
      this.#replaceFormToCard.call(this);
    }
  };

  /**
   * @param {Point} point
   */
  #handlePointEditorSubmit = (point) => {
    this.#replaceFormToCard.call(this);
    this.#dataChangeHandler(point);
  };

  #handlePointCardClick = () => {
    this.#replaceCardToForm.call(this);
  };

  #handlePointEditorClick = () => {
    this.#replaceFormToCard.call(this);
  };

}
