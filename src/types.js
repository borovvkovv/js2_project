/**
 * @typedef Point
 * @property {number} basePrice
 * @property {string} dateFrom
 * @property {string} dateTo
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
 * @typedef filterState
 * @property {string} filterName
 * @property {boolean} isAnyPoints
 */

/**
 * @callback FilterCallback
 * @param {Point[]} points
 * @return {Point[]}
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
 * @param {Point} point
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
 * @typedef {import('./model/points-model').default} PointsModel
 */

/**
 * @typedef PointViewState
 * @property {number} basePrice
 * @property {string} dateFrom
 * @property {string} dateTo
 * @property {Destination} destination
 * @property {number} id
 * @property {OffersWithCheck[]} offers
 * @property {string} type
 */

/**
 * @typedef {import('node_modules/flatpickr/dist/types/instance').Instance} Calendar
 * @typedef {import ('node_modules/flatpickr/dist/types/options').Options} CalendarConfig
 */
