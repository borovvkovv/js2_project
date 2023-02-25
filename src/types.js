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
 * @typedef {import('./model/points-model').default} PointsModel
 */
