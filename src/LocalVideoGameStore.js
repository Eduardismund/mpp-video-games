import CRC32 from "crc-32";
import {computePercentile} from "./utils.js";
import videoGamesJson from "./video-games.json" with {type: "json"};
import genreListJson from "./genre.json" with {type: "json"};

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
 * @implements {VideoGameStore}
 */
class LocalVideoGameStore {
  /**
   *
   * @type {string[]}
   */
  genreList = []


  /**
   *
   * @type {{[key:string]: videoGameSubscriber}}
   * @private
   */
  videoGameSubscribers = {}


  /**
   *
   * @type {VideoGame[]}
   */
  videoGameList = []

  /**
   *
   * @param {VideoGame[]} videoGamesList
   * @param {string[]} genreList
   */
  constructor(videoGamesList, genreList) {
    videoGamesList.forEach(vg => vg.id = _computeVideoGameId(vg.name))
    this.videoGameList = videoGamesList
    this.genreList = genreList
  }


  /**
   * @param {VideoGameListParams} params
   * @returns {Promise<VideoGameListPage>}
   */
  getVideoGamesList(params) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const filters = []
        if (params?.nameEq !== undefined) {
          const idEq = await this.computeVideoGameId(params.nameEq)
          filters.push((item) => item.id === idEq)
        }
        if (params?.minPrice !== undefined) {
          filters.push((item) => item.price >= params.minPrice)
        }
        if (params?.maxPrice !== undefined) {
          filters.push((item) => item.price <= params.maxPrice)
        }
        const filteredItems = this.videoGameList
          .filter((item) => filters.filter(filter => !filter(item)).length === 0)
        const indexFilters = []
        if (params?.offset !== undefined) {
          indexFilters.push((index) => index >= params.offset)
        }
        if (params?.maxItems !== undefined) {
          indexFilters.push((index) => index < (params.offset || 0) + params.maxItems)
        }
        const items = filteredItems
          .filter((_, index) => indexFilters.filter(filter => !filter(index)).length === 0)
          .map(item => ({...item}))
        resolve({items, totalCount: filteredItems.length})
      }, 100)
    });
  }


  /**
   * @param {StatisticsRqPriceMetrics} request
   * @private
   */
  computePriceMetrics(request) {
    /**
     *
     * @type {Metrics}
     */
    const result = {}

    const sortedPrices = this.videoGameList.map(vg => vg.price).sort()
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
   * @returns {Promise<StatisticsRs>}
   */
  getVideoGameStatistics(requiredStatistics) {

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {}
        if (requiredStatistics?.priceMetrics) {
          result.priceMetrics = this.computePriceMetrics(requiredStatistics.priceMetrics)
        }
        if (requiredStatistics?.totalCount) {
          result.totalCount = this.videoGameList.length
        }

        if (requiredStatistics?.genrePopularity) {
          result.genrePopularity = this.computeGenrePopularity(requiredStatistics.genrePopularity)
        }
        if (requiredStatistics?.releaseYears) {
          result.releaseYears = this.computeReleaseYearDistribution()
        }
        resolve(result)
      }, 100)
    });
  }

  computeGenrePopularity(expectedCount) {
    const genres = {}
    this.videoGameList.forEach(vg => genres[vg.genre] = genres[vg.genre] === undefined ? 1 : genres[vg.genre] + 1)
    return Object.keys(genres).map(genre => ({genre, count: genres[genre]}))
      .sort((a, b) => b.count - a.count)
      .slice(0, expectedCount)

  }

  computeReleaseYearDistribution() {
    const releaseYears = {};

    this.videoGameList.forEach((game) => {
      const releaseYear = new Date(game.releaseDate).getFullYear();
      releaseYears[releaseYear] = releaseYears[releaseYear] === undefined ? 1 : releaseYears[releaseYear] + 1;
    });

    return Object.keys(releaseYears)
      .map((year) => ({year: parseInt(year), count: releaseYears[year]}))
      .sort((a, b) => a.year - b.year); // Sort by year
  }

  /**
   *
   * @param {string} videoGameName
   * @returns {Promise<string>}
   */
  computeVideoGameId(videoGameName) {
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
  addVideoGame(videoGame) {
    return this.computeVideoGameId(videoGame.name)
      .then(id => {
        const item = {...videoGame, id};
        this.videoGameList.push(item)
        this.notifySubscribers('create', item)
        return id;
      })
  }

  /**
   *
   * @param {Partial<VideoGame>} videoGame
   * @returns {Promise<void>}
   */
  async updateVideoGame(videoGame) {
    const foundVideoGame = await this.getVideoGameById(videoGame.id)
    if (foundVideoGame) {
      Object.keys(videoGame).forEach(key => {
        if (videoGame[key] !== '' && key !== 'name') {
          foundVideoGame[key] = videoGame[key];
        }
      })
      this.notifySubscribers('update', foundVideoGame)
    }

  }

  /**
   *
   * @param {string} videoGameId
   * @returns {Promise<void>}
   */
  deleteVideoGame(videoGameId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.videoGameList.findIndex(game => game.id === videoGameId)
        const videoGame = this.videoGameList[index]
        this.videoGameList.splice(index, 1)
        this.notifySubscribers('delete', videoGame)
        resolve();
      }, 100)
    })
  }


  /**
   *
   * @param {string} videoGameName
   * @returns {Promise<VideoGame|undefined>}
   */
  async getVideoGameByName(videoGameName) {
    const id = await this.computeVideoGameId(videoGameName)
    return await this.getVideoGameById(id)
  }

  /**
   *
   * @returns {Promise<VideoGame|undefined>}
   * @param {string} videoGameId
   */
  getVideoGameById(videoGameId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.videoGameList.find(game => game.id === videoGameId))
      }, 100)
    })
  }

  /**
   *
   * @returns {Promise<string>}
   */
  getGenreList() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.genreList)

      }, 1000)
    })
  }

  /**
   *
   * @param {string} key
   * @param {videoGameSubscriber} subscriber
   */
  addSubscriber(key, subscriber) {
    this.videoGameSubscribers[key] = subscriber
  }

  removeSubscriber(key) {
    delete this.videoGameSubscribers[key]
  }

  /**
   *
   * @param {'create'|'delete'|'update'} action
   * @param {any} [payload]
   */
  notifySubscribers(action, payload) {
    setTimeout(() => {
      Object.values(this.videoGameSubscribers).forEach((subscriber) => {
        subscriber(action, payload);
      }, 100);
    })
  }

  setWrapperCallback(callback) {
  }
}

/**
 * @param {Object} [params]
 * @param {VideoGame[]} [params.videoGameList]
 * @param {string[]} [params.genreList]
 * @returns {VideoGameStore}
 */
export function newLocalVideoGameStore(params) {
  let vgList = params?.videoGameList
  if (!vgList) {
    vgList = videoGamesJson
  }
  let genList = params?.genreList
  if (!genList) {
    genList = genreListJson
  }
  return new LocalVideoGameStore(vgList, genList)
}

