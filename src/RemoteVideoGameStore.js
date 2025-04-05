import {convertPropertiesToString, extractProperties} from "./utils.js";

/**
 * @implements {VideoGameStore}
 */
class RemoteVideoGameStore{


  /**
   *
   * @type {{[key:string]: EventSource}}
   */
  videoGameSubscribers = {}


  /**
   *
   * @param {string} key
   * @param {videoGameSubscriber} subscriber
   */
  addSubscriber(key, subscriber) {
    if (this.videoGameSubscribers[key]) {
      this.removeSubscriber(key)
    }
    const eventSource = new EventSource('http://localhost:5000/api/video-games/subscriptions');


    eventSource.addEventListener('update', (event) => {
      subscriber(event?.type, JSON.parse(event?.data))
    })

    eventSource.addEventListener('create', (event) => {
      subscriber(event?.type, JSON.parse(event?.data))
    })

    eventSource.addEventListener('delete', (event) => {
      subscriber(event?.type, JSON.parse(event?.data))
    })

    eventSource.onerror = (error) => {
      console.error('Error on video game subscription', error);
    };

    this.videoGameSubscribers[key] = eventSource

  }

  removeSubscriber(key) {
    delete this.videoGameSubscribers[key]
  }


  /**
   * @param {Object} [params]
   * @param {number} [params.minPrice]
   * @param {number} [params.maxPrice]
   * @param {number} [params.offset]
   * @param {number} [params.maxItems]
   * @returns {Promise<{items: VideoGame[], totalCount: number}>}
   */
  async getVideoGamesList(params) {
    const filteredParams = convertPropertiesToString(/**@type any*/params, {
      minPrice: 'number',
      maxPrice: 'number',
      offset: 'number',
      maxItems: 'number'
    })
    const query = new URLSearchParams(filteredParams)
    const response = await this.fetchOrThrow(fetch(`/api/video-games?${query}`))
    if (response.ok) {
      return await response.json()
    }
    return {items: [], totalCount: 0}

  }


  /**
   * @param {StatisticsRq} requiredStatistics
   * @returns {Promise<StatisticsRs>}
   */
  async getVideoGameStatistics(requiredStatistics) {
    const response = await this.fetchOrThrow(fetch(`/api/video-games/statistics`, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(requiredStatistics)
    }))
    if (response.ok) {
      return await response.json()
    }
    return {}


  }


  /**
   * @param {Partial<VideoGame>} videoGame
   * @returns {Promise<string>}
   */
  async addVideoGame(videoGame) {
    const response = await this.fetchOrThrow(fetch(`/api/video-games`, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(extractProperties(videoGame, {
        name: 'string',
        genre: 'string',
        releaseDate: 'string',
        price: 'string'
      }))
    }))
    if (response.status === 201) {
      return (await response.json()).id
    }
    return undefined
  }

  /**
   *
   * @param videoGame
   * @returns {Promise<void>}
   */
  async updateVideoGame(videoGame) {
    await this.fetchOrThrow(fetch(`/api/video-games/${videoGame.id}`, {
      method: 'PATCH',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(extractProperties(videoGame, {
        genre: 'string',
        releaseDate: 'string',
        price: 'string'
      }))
    }))
  }

  /**
   *
   * @param {string} videoGameId
   * @returns {Promise<void>}
   */
  async deleteVideoGame(videoGameId) {
    await this.fetchOrThrow(fetch(`/api/video-games/${videoGameId}`, {
      method: 'DELETE'
    }))
  }

  /**
   *
   * @param videoGameName
   * @returns {Promise<VideoGame|undefined>}
   */
  async getVideoGameByName(videoGameName) {
    const query = new URLSearchParams({maxItems: '1', nameEq: videoGameName})
    const response = await this.fetchOrThrow(fetch(`/api/video-games?${query}`))
    if (response.ok) {
      return (await response.json())?.items[0]
    }
    return undefined
  }

  async fetchOrThrow(responsePromise) {
    let response
    try {
      response = await responsePromise
    } catch (ex) {
      if (ex.message === 'Failed to fetch') {
        throw new Error('ERR_NET');
      }
      throw  ex
    }
    if (response.status >= 500) {
      throw new Error('ERR_SERVER')
    }
    return response
  }

  /**
   *
   * @param {string} videoGameId
   * @returns {Promise<VideoGame|undefined>}
   */
  async getVideoGameById(videoGameId) {
    const response = await this.fetchOrThrow(fetch(`/api/video-games/${videoGameId}`))
    if (response.ok) {
      return response.json()
    }
    return undefined
  }


  computeVideoGameId(videoGameName) {
    return Promise.resolve("");
  }

  async getGenreList() {
    const response = await this.fetchOrThrow(fetch('/api/genres'))
    if (response.ok) {
      return await response.json()
    }
    return []

  }
}

/**
 *
 * @returns {VideoGameStore}
 */
export function newRemoteVideoGameStore() {
  return new RemoteVideoGameStore()
}




