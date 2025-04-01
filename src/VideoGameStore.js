/**
 * @typedef {Object} VideoGame
 * @property {string} id
 * @property {string} name
 * @property {string} genre
 * @property {string} releaseDate
 * @property {number} price
 */

import * as CRC32 from "crc-32";
import videoGamesJson from "./video-games.json"
import {computePercentile} from "./utils.js";

/**
 *
 * @type VideoGame[]
 */
const videoGamesList = videoGamesJson.map(videoGame => ({
  ...videoGame,
  id: _computeVideoGameId(videoGame.name)
}))

/**
 * @param {number} [minPrice]
 * @param {number} [maxPrice]
 * @returns {Promise<VideoGame[]>}
 */
export function getVideoGamesList({minPrice, maxPrice}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filters = []
      if (minPrice !== undefined) {
        filters.push((item) => item.price >= minPrice)
      }
      if (maxPrice !== undefined) {
        filters.push((item) => item.price <= maxPrice)
      }
      resolve(videoGamesList
        .filter(item => filters.filter(filter => !filter(item)).length === 0)
        .map(item => ({...item}))
      )
    }, 100)
  });
}

/**
 * @typedef {Object} Metrics
 * @property {number} min
 * @property {number} max
 * @property {number} median
 * @property {{p:number, v: number}[]} percentiles
 */

/**
 * @typedef {Object} StatisticsRqPriceMetrice
 * @property {boolean} [min]
 * @property {boolean} [max]
 * @property {number[]} [percentiles]
 */

/**
 * @typedef {Object} StatisticsRq
 * @property {StatisticsRqPriceMetrice} [priceMetrics]
 */


/**
 * @param {StatisticsRqPriceMetrice} request
 */
function computePriceMetrics(request) {
  /**
   *
   * @type {Metrics}
   */
  const result = {}

  const sortedPrices = videoGamesList.map(vg => vg.price).sort()
  for (let price of sortedPrices) {
    if (request.min) {
      result.min = result.min === undefined ? price : Math.min(result.min, price)
    }
    if (request.max) {
      result.max = result.max === undefined ? price : Math.max(result.max, price)
    }
    if (request.percentiles) {
      result.percentiles = request.percentiles.map(p => ({p, v: computePercentile(sortedPrices, p)}))
    }

  }
  return result
}

/**
 * @param {StatisticsRq} requiredStatistics
 * @returns {Promise<{priceMetrics?: Metrics}>}
 */
export function getVideoGameStatistics(requiredStatistics) {

  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {}
      if (requiredStatistics?.priceMetrics) {
        result.priceMetrics = computePriceMetrics(requiredStatistics.priceMetrics)
      }
      resolve(result)
    }, 100)
  });
}

/**
 *
 * @param {string} videoGameName
 * @returns {string}
 * @private
 */
function _computeVideoGameId(videoGameName) {
  return (CRC32.str(videoGameName.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase()) >>> 0).toString(16)
}

/**
 *
 * @param {string} videoGameName
 * @returns {Promise<string>}
 */
export function computeVideoGameId(videoGameName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_computeVideoGameId(videoGameName))
    }, 100)
  })
}

/**
 * @param {Partial<VideoGame>} videoGame
 * @returns {Promise<string>}
 */
export function addVideoGame(videoGame) {
  return computeVideoGameId(videoGame.name)
    .then(id => {
      videoGamesList.push({...videoGame, id})
      return id;
    })
}

/**
 *
 * @param videoGame
 * @returns {Promise<void>}
 */
export async function updateVideoGame(videoGame) {
  const foundVideoGame = await getVideoGameById(videoGame.id)
  foundVideoGame && Object.keys(videoGame).forEach(key => {
    if (videoGame[key] !== '' && key !== 'name') {
      foundVideoGame[key] = videoGame[key];
    }
  })
}

/**
 *
 * @param {string} videoGameId
 * @returns {Promise<void>}
 */
export function deleteVideoGame(videoGameId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = videoGamesList.findIndex(game => game.id === videoGameId)
      videoGamesList.splice(index, 1)
      resolve();
    }, 100)
  })
}

/**
 *
 * @param videoGameName
 * @returns {Promise<VideoGame|undefined>}
 */
export async function getVideoGameByName(videoGameName) {
  const id = await computeVideoGameId(videoGameName)
  return await getVideoGameById(id)
}


/**
 *
 * @returns {Promise<VideoGame|undefined>}
 * @param {string} videoGameId
 */
export function getVideoGameById(videoGameId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(videoGamesList.find(game => game.id === videoGameId))
    }, 100)
  })
}

