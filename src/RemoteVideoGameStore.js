import {convertPropertiesToString, extractProperties} from "./utils.js";


/**
 *
 * @type {{[key:string]: EventSource}}
 */
const videoGameSubscribers = {}

/**
 *
 * @param {string} key
 * @param {videoGameSubscriber} subscriber
 */
export function addSubscriber(key, subscriber) {
  if (videoGameSubscribers[key]) {
    removeSubscriber(key)
  }
  const eventSource = new EventSource('http://localhost:5000/api/video-games/subscriptions');


  eventSource.addEventListener('update', (event) => {
    subscriber(event.type, JSON.parse(event?.data))
  })

  eventSource.addEventListener('create', (event) => {
    subscriber(event.type, JSON.parse(event?.data))
  })

  eventSource.addEventListener('delete', (event) => {
    subscriber(event.type, JSON.parse(event?.data))
  })

  eventSource.onerror = (error) => {
    console.error('Error on video game subscription', error);
  };

  videoGameSubscribers[key] = eventSource

}

export function removeSubscriber(key) {
  delete videoGameSubscribers[key]
}


/**
 * @param {Object} [params]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {number} [params.offset]
 * @param {number} [params.maxItems]
 * @returns {Promise<{items: VideoGame[], totalCount: number}>}
 */
export async function getVideoGamesList(params) {
  const filteredParams = convertPropertiesToString(/**@type any*/params, {
    minPrice: 'number',
    maxPrice: 'number',
    offset: 'number',
    maxItems: 'number'
  })
  const query = new URLSearchParams(filteredParams)
  const response = await fetch(`/api/video-games?${query}`)
  if (response.ok) {
    return await response.json()
  }
  return {items: [], totalCount: 0}

}


/**
 * @param {StatisticsRq} requiredStatistics
 * @returns {Promise<StatisticsRs>}
 */
export async function getVideoGameStatistics(requiredStatistics) {
  const response = await fetch(`/api/video-games/statistics`, {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(requiredStatistics)
  })
  if (response.ok) {
    return await response.json()
  }
  return {}


}


/**
 * @param {Partial<VideoGame>} videoGame
 * @returns {Promise<string>}
 */
export async function addVideoGame(videoGame) {
  const response = await fetch(`/api/video-games`, {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(extractProperties(videoGame, {
      name: 'string',
      genre: 'string',
      releaseDate: 'string',
      price: 'string'
    }))
  })
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
export async function updateVideoGame(videoGame) {
  await fetch(`/api/video-games/${videoGame.id}`, {
    method: 'PATCH',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(extractProperties(videoGame, {
      genre: 'string',
      releaseDate: 'string',
      price: 'string'
    }))
  })
}

/**
 *
 * @param {string} videoGameId
 * @returns {Promise<void>}
 */
export async function deleteVideoGame(videoGameId) {
  await fetch(`/api/video-games/${videoGameId}`, {
    method: 'DELETE'
  })
}

/**
 *
 * @param videoGameName
 * @returns {Promise<VideoGame|undefined>}
 */
export async function getVideoGameByName(videoGameName) {
  const query = new URLSearchParams({maxItems: '1', nameEq: videoGameName})
  const response = await fetch(`/api/video-games?${query}`)
  if (response.ok) {
    return (await response.json())?.items[0]
  }
  return undefined
}


/**
 *
 * @param {string} videoGameId
 * @returns {Promise<VideoGame|undefined>}
 */
export async function getVideoGameById(videoGameId) {
  const response = await fetch(`/api/video-games/${videoGameId}`)
  if (response.ok) {
    return response.json()
  }
  return undefined
}

