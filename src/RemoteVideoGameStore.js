import {convertPropertiesToString, extractProperties} from "./utils.js";

const baseUrl = 'http://localhost:5000'

/**
 * @implements {VideoGameStore}
 */
class RemoteVideoGameStore {


    /**
     *
     * @type {{[key:string]: videoGameSubscriber}}
     * @private
     */
    subscribers = {}

    /**
     *
     * @type {EventSource}
     * @private
     */
    eventSource


    /**
     * @type {Function}
     * @private
     */
    connectionMonitor

    constructor() {

        const eventSource = new EventSource(`${baseUrl}/api/video-games/subscriptions`);

        eventSource.addEventListener('update', (event) => {
            this.notifySubscribers('update', JSON.parse(event?.data))
        })

        eventSource.addEventListener('create', (event) => {
            this.notifySubscribers('create', JSON.parse(event?.data))
        })

        eventSource.addEventListener('delete', (event) => {
            this.notifySubscribers('delete', JSON.parse(event?.data))
        })

        eventSource.addEventListener('ping', (event) => {
            this.connectionMonitor && this.connectionMonitor('ping', event?.data)
        })

        eventSource.onerror = (error) => {
            this.connectionMonitor && this.connectionMonitor('error', error)
        };
        eventSource.onopen = (event) => {
            this.connectionMonitor && this.connectionMonitor('open', event)
        };

        this.eventSource = eventSource

    }


    /**
     *
     * @param {string} action
     * @param {any} payload
     * @private
     */
    notifySubscribers(action, payload) {
        Object.keys(this.subscribers).map(key => this.subscribers[key])
            .forEach(subscriber => subscriber(action, payload))
    }


    /**
     *
     * @param {string} key
     * @param {videoGameSubscriber} subscriber
     */
    addSubscriber(key, subscriber) {
        this.subscribers[key] = subscriber
    }

    removeSubscriber(key) {
        delete this.subscribers[key]
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
        const response = await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games?${query}`))
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
        const response = await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games/statistics`, {
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
        const response = await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games`, {
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
        await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games/${videoGame.id}`, {
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
        await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games/${videoGameId}`, {
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
        const response = await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games?${query}`))
        if (response.ok) {
            return (await response.json())?.items[0]
        }
        return undefined
    }

    /**
     * @private
     * @param {Promise<Response>} responsePromise
     * @returns {Promise<*>}
     */
    async fetchOrThrow(responsePromise) {
        let response
        try {
            response = await responsePromise
        } catch (ex) {
            if (ex.message === 'Failed to fetch') {
                throw new Error('ERR_NET');
            }
            throw ex
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
        const response = await this.fetchOrThrow(fetch(`${baseUrl}/api/video-games/${videoGameId}`))
        if (response.ok) {
            return response.json()
        }
        return undefined
    }


    computeVideoGameId(videoGameName) {
        return Promise.resolve("");
    }

    async getGenreList() {
        const response = await this.fetchOrThrow(fetch(`${baseUrl}/api/genres`))
        if (response.ok) {
            return await response.json()
        }
        return []

    }
}

/**
 *
 * @param {Object} params
 * @param {Function} [params.connectionMonitor]
 * @returns {VideoGameStore}
 */
export function newRemoteVideoGameStore(params) {
    const store = new RemoteVideoGameStore()
    params?.connectionMonitor && (store.connectionMonitor = params.connectionMonitor)
    return store

}




