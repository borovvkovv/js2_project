import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';
import {UpdateType, UserAction} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {

  /** @type {Point} */
  #point;

  #pointsModel;
  #pointsListContainer;

  /** @type PointEditorView */
  #pointEditor = null;

  /** @type PointView */
  #pointCard = null;

  #mode = Mode.DEFAULT;

  #dataChangeHandler;
  #modeChangeHandler;

  #uiBlocker;

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

    this.#uiBlocker = new UiBlocker({
      lowerLimit: 0,
      upperLimit: 1000
    });
  }

  /** @param {Point} point */
  init(point) {
    this.#point = point;

    const prevPointCard = this.#pointCard;
    const prevPointEditor = this.#pointEditor;

    this.#pointCard = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destinationId),
      offersByType: this.#pointsModel.getOffersByType(point.type),
      onClick: this.#handlePointCardClick
    });

    this.#pointEditor = new PointEditorView({
      point,
      cityNames: this.#pointsModel.getCitiesNames(),
      isNew: false,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      pointTypes: this.#pointsModel.pointTypes,
      onSubmit: this.#handlePointEditorSubmit,
      onClick: this.#handlePointEditorClick,
      onReset: this.#handlePointEditorDelete
    });

    if (prevPointCard === null || prevPointEditor === null) {
      render(this.#pointCard, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointCard, prevPointCard);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointCard, prevPointEditor);
      this.#mode = Mode.DEFAULT;
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

      this.#pointEditor.reset(
        this.#point,
        this.#pointsModel.getDestinationById(this.#point.destinationId),
        this.#pointsModel.getOffersByType(this.#point.type)
      );
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditor.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditor.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointCard.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditor.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointEditor.shake(resetFormState);
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
    // this.#modeChangeHandler();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
      // this.#replaceFormToCard.call(this);
    }
  };

  /**
   * @param {Point} update
   */
  #handlePointEditorSubmit = (update) => {
    this.#uiBlocker.block();

    const isMinorUpdate = this.#point.endDate !== update.endDate;

    this.#dataChangeHandler(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update);

    this.#uiBlocker.unblock();
    // this.#replaceFormToCard.call(this);
  };

  #handlePointCardClick = () => {
    this.#replaceCardToForm.call(this);
  };

  #handlePointEditorClick = () => {
    this.resetView();
    // this.#replaceFormToCard.call(this);
  };

  #handlePointEditorDelete = (point) => {
    this.#uiBlocker.block();
    this.#dataChangeHandler(UserAction.DELETE_POINT, UpdateType.MINOR, point);
    this.#uiBlocker.unblock();
  };

}
