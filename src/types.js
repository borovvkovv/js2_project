/**
 * @typedef Point
 * @property {number} basePrice
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} destinationId
 * @property {number} id
 * @property {number[]} offerIds
 * @property {string} type
 */

/**
 * @typedef LocalPoint
 * @property {number} basePrice
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} destinationId
 * @property {number[]} offerIds
 * @property {string} type
 */

/**
 * @typedef ServerPoint
 * @property {number} base_price
 * @property {string} date_from
 * @property {string} date_to
 * @property {number} destination
 * @property {number} id
 * @property {number[]} offers
 * @property {string} type
 */

/**
 * @typedef OffersByType
 * @property {string} type
 * @property {Offer[]} offers
 */

/**
 * @typedef Offer
 * @property {number} id
 * @property {string} title
 * @property {number} price
 */

/**
 * @typedef Destination
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {Picture[]} pictures
 */

/**
 * @typedef Picture
 * @property {string} src
 * @property {string} description
 */

/**
 * @typedef OffersWithCheck
 * @property {boolean} checked
 * @property {Offer} offer
 */

////////////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef FilterState
 * @property {string} filterType
 * @property {string} filterName
 * @property {boolean} isAnyPoints
 */

/**
 * @callback FilterCallback
 * @param {Point} points
 * @return {boolean}
 */

/**
 * @callback SortCallback
 * @param {Point} point1
 * @param {Point} point2
 * @return {number}
 */

/**
 * @callback OnSubmitHandler
 * @param {Point} point
 * @returns {void}
 */

/**
 * @callback OnClickHandler
 * @returns {void}
 */

/**
 * @callback OnDataChangeHandler
 * @param {string} userAction
 * @param {string} UpdateType
 * @param {Point} update
 * @returns {void}
 */

/**
 * @callback OnModeChangeHandler
 * @returns {void}
 */

/**
 * @callback OnSortTypeChangeHandler
 * @param {string} sortType
 * @returns {void}
 */

/**
 * @callback onFilterChangeHandler
 * @param {string} filterType
 * @returns {void}
 */

/**
 * @callback OnNewPointDestroy
 * @returns {void}
 */

/**
 * @callback OnDeleteHandler
 * @param {Point}
 * @returns {void}
 */

/**
 * @typedef {import('./model/points-model').default} PointsModel
 * @typedef {import('./model/filter-model').default} FilterModel
 *
 @typedef {import('./points-api-service').default} PointsApiService
 */

/**
 * @typedef PointViewState
 * @property {number} basePrice
 * @property {Date} dateFrom
 * @property {Date} dateTo
 * @property {Destination} destination
 * @property {number} id
 * @property {OffersWithCheck[]} offers
 * @property {string} type
 * @property {boolean} isDisabled
 * @property {boolean} isSaving
 * @property {boolean} isDeleting
 */

/**
 * @typedef {import('node_modules/flatpickr/dist/types/instance').Instance} Calendar
 * @typedef {import ('node_modules/flatpickr/dist/types/options').Options} CalendarConfig
 */
