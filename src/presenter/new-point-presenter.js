import {UpdateType, UserAction, pointTypes} from '../const';
import {remove, render, RenderPosition} from '../framework/render';
import PointEditorView from '../view/point-editor-view';

export default class NewPointPresenter {
  #pointsContainer;
  #handleDataChange;
  #handleDestroy;

  /**@type {PointsModel} */
  #pointsModel;

  #pointEditView = null;

  constructor({pointsContainer, pointsModel, onChange, onDestroy}) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditView !== null) {
      return;
    }

    /**@type {LocalPoint} */
    const defaultPoint = {
      basePrice: 100,
      startDate: null,
      endDate: null,
      destinationId: 1,
      offerIds: [],
      type: pointTypes[0]
    };

    this.#pointEditView = new PointEditorView({
      point: defaultPoint,
      cityNames: this.#pointsModel.getCitiesNames(),
      isNew: true,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      pointTypes,
      onSubmit: this.#handlePointEditorSubmit,
      onClick: this.#handlePointEditorClick,
      onReset: this.#handlePointEditorReset
    });

    render(this.#pointEditView, this.#pointsContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditView === null) {
      return;
    }

    remove(this.#pointEditView);
    this.#pointEditView = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#handleDestroy();
  }

  setSaving() {
    this.#pointEditView.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointEditView.shake(resetFormState);
  }

  #handlePointEditorSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );

    // this.destroy();
  };

  #handlePointEditorReset = () => {
    this.destroy();
  };

  #handlePointEditorClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

}
