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
 *  @callback videoGameSubscriber
 *  @param {'create'|'delete'|'update'} action
 *  @param {any} [payload]
 */

/**
 *
 * @type {{[key:string]: videoGameSubscriber}}
 */
const videoGameSubscribers = []

/**
 *
 * @param {string} key
 * @param {videoGameSubscriber} subscriber
 */
export function addSubscribers(key, subscriber) {
  videoGameSubscribers[key] = subscriber
}


/**
 *
 * @param {'create'|'delete'|'update'} action
 * @param {any} [payload]
 */
export function notifySubscribers(action, payload) {
  setTimeout(() =>{
    Object.values(videoGameSubscribers).forEach((subscriber) => {
      subscriber(action, payload);
    }, 100);
  })
}

/**
 * @param {Object} [params]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {number} [params.offset]
 * @param {number} [params.maxItems]
 * @returns {Promise<VideoGame[]>}
 */
export function getVideoGamesList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filters = []
      if (params?.minPrice !== undefined) {
        filters.push((item) => item.price >= params.minPrice)
      }
      if (params?.maxPrice !== undefined) {
        filters.push((item) => item.price <= params.maxPrice)
      }
      if (params?.offset !== undefined) {
        filters.push((item, index) => index >= params.offset)
      }
      if (params?.maxItems !== undefined) {
        filters.push((item, index) => index < (params.offset || 0) + params.maxItems)
      }
      resolve(videoGamesList
        .filter((item, index) => filters.filter(filter => !filter(item, index)).length === 0)
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
 * @property {number} [genrePopularity]
 * @property {boolean} [releaseYears]
 * @property {boolean} [totalCount]
 */

/**
 * @typedef {Object} StatisticsRs
 * @property {Metrics} [priceMetrics]
 * @property {number} [totalCount]
 * @property {PopularGenre[]} [genrePopularity]
 * @property {ReleaseYear[]} [releaseYears]
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
 * @typedef {Object} PopularGenre
 * @property {string} genre
 * @property {number} count
 *//**
 * @typedef {Object} ReleaseYear
 * @property {number} year
 * @property {number} count
 */

/**
 *
 */
/**
 * @param {StatisticsRq} requiredStatistics
 * @returns {Promise<StatisticsRs>}
 */
export function getVideoGameStatistics(requiredStatistics) {

  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {}
      if (requiredStatistics?.priceMetrics) {
        result.priceMetrics = computePriceMetrics(requiredStatistics.priceMetrics)
      }
      if (requiredStatistics?.totalCount) {
        result.totalCount = videoGamesList.length
      }

      if(requiredStatistics?.genrePopularity){
        result.genrePopularity = computeGenrePopularity(requiredStatistics.genrePopularity)
      }
      if(requiredStatistics?.releaseYears){
        result.releaseYears = computeReleaseYearDistribution()
      }
      resolve(result)
    }, 100)
  });
}

function computeGenrePopularity(expectedCount) {
  const genres = {}
  videoGamesList.forEach(vg => genres[vg.genre] = genres[vg.genre] ===undefined? 1 : genres[vg.genre] + 1)
  return Object.keys(genres).map(genre => ({genre, count: genres[genre]}))
    .sort((a,b) => b.count -a.count)
    .slice(0, expectedCount)

}

function computeReleaseYearDistribution() {
  const releaseYears = {};

  videoGamesList.forEach((game) => {
    const releaseYear = new Date(game.releaseDate).getFullYear();
    releaseYears[releaseYear] = releaseYears[releaseYear] === undefined ? 1 : releaseYears[releaseYear] + 1;
  });

  return Object.keys(releaseYears)
    .map((year) => ({ year: parseInt(year), count: releaseYears[year] }))
    .sort((a, b) => a.year - b.year); // Sort by year
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
      const item = {...videoGame, id};
      videoGamesList.push(item)
      notifySubscribers('create', item)
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
  if(foundVideoGame){
    Object.keys(videoGame).forEach(key => {
      if (videoGame[key] !== '' && key !== 'name') {
        foundVideoGame[key] = videoGame[key];
      }
    })
    notifySubscribers('update', foundVideoGame)
  }

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
      const videoGame = videoGamesList[index]
      videoGamesList.splice(index, 1)
      notifySubscribers('delete', videoGame)
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

