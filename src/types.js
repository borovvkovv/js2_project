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

/**
 * @typedef {import('./model/points-model').default} PointsModel
 */
