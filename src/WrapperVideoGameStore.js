import {newRemoteVideoGameStore} from "./RemoteVideoGameStore.js";
import {newLocalVideoGameStore} from "./LocalVideoGameStore.js";

/**
 * @implements {VideoGameStore}
 */
class WrapperVideoGameStore {
    /**
     *
     * @type {{[string]: videoGameSubscriber}}
     * @private
     */
    subscribers = {}
    /**
     *
     * @type {string[]}
     * @private
     */
    cachedGenresList = []
    /**
     *
     * @type {VideoGame[]}
     * @private
     */
    cachedVideoGamesList = []

    /**
     *
     * @type {{action: 'create' | 'update' | 'delete', payload?: Partial<VideoGame>}[]}
     * @private
     */
    crudHistory = undefined

    /**
     * @type {VideoGameStore}
     * @private
     */
    remoteStore

    /**
     * @type {VideoGameStore}
     * @private
     */
    activeStore

    /**
     * @type {number} set interval id
     * @private
     */
    pingCheck

    /**
     * @type {number} timestamp of the last ping
     * @private
     */
    lastPing

    /**
     *
     * @type {{server: boolean, network: boolean}}
     */
    issues = {server: false, network: false}

    get mode() {
        return this.crudHistory ? 'local' : 'remote'
    }

    constructor() {

        this.remoteStore = newRemoteVideoGameStore({connectionMonitor: this.onConnectionEvent.bind(this)})
        this.activeStore = this.remoteStore
        this._setupSubscribers()
        this.pingCheck = setInterval(async () => {
            if (Date.now() - this.lastPing > 2000) {
                console.log('pingTimeout')
                await this.switchToLocal( 'ERR_SERVER')
            }
        })

    }

    async onConnectionEvent(connectionEvent, payload) {
        if (connectionEvent === "ping") {
            this.lastPing = Date.now()
            await this.switchToRemote()
            return
        }
        if (connectionEvent === "open") {
            console.log("Connection opened", payload)
            return
        }
        if (connectionEvent === "error") {
            console.error("Connection error", payload, payload?.message)
            await this.switchToLocal(payload?.target?.readyState === 0 ? 'ERR_NET' : 'ERR_SERVER')
        }

    }

    /**
     *
     * @param {'ERR_NET' | 'ERR_SERVER' | string} [reason]
     * @returns {Promise<void>}
     */
    async switchToLocal(reason) {
        if (this.mode === 'local') {
            return
        }

        this.activeStore = newLocalVideoGameStore({
            videoGameList: this.cachedVideoGamesList,
            genreList: this.cachedGenresList
        })
        this._setupSubscribers()
        this.crudHistory = []
        console.log('switched to mode', this.mode, reason)
        this.onModeChange(this.mode, reason)
    }

    async switchToRemote() {
        if (this.mode === 'remote') {
            return
        }
        this.activeStore = this.remoteStore
        this._setupSubscribers()
        for (let step of this.crudHistory) {
            const {action, payload} = step
            if (action === 'create') await this.remoteStore.addVideoGame(payload)
            else if (action === 'update') await this.remoteStore.updateVideoGame(payload)
            else if (action === 'delete') await this.remoteStore.deleteVideoGame(payload.id)
        }
        this.crudHistory = undefined
        console.log('switched to mode', this.mode)
        this.onModeChange(this.mode)
    }


    removeSubscriber(key) {

        delete this.subscribers[key]
    }


    addSubscriber(key, subscriber) {
        this.subscribers[key] = subscriber
    }

    async addVideoGame(videoGame) {
        try {
            const newId = await this.activeStore.addVideoGame(videoGame);
            this.crudHistory?.push({action: 'create', payload: videoGame})
            return newId
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.addVideoGame(videoGame)
            }
            throw ex
        }
    }


    async updateVideoGame(videoGame) {
        try {
            await this.activeStore.updateVideoGame(videoGame)
            this.crudHistory?.push({action: 'update', payload: videoGame})
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.updateVideoGame(videoGame)
            }
            throw ex
        }
    }


    async deleteVideoGame(videoGameId) {
        try {
            await this.activeStore.deleteVideoGame(videoGameId)
            this.crudHistory?.push({action: 'delete', payload: {id: videoGameId}})
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.deleteVideoGame(videoGameId)
            }
            throw ex
        }
    }


    async computeVideoGameId(videoGameName) {
        try {
            return this.activeStore.computeVideoGameId(videoGameName)
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.computeVideoGameId(videoGameName)
            }
            throw ex
        }
    }

    async getGenreList() {
        let genres
        try {
            genres = await this.activeStore.getGenreList()
        }
        catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.getGenreList()
            }
            throw ex
        }
        !this.crudHistory && (this.cachedGenresList = [...genres])
        return genres
    }

    async getVideoGameById(videoGameId) {
        try {
            return this.activeStore.getVideoGameById(videoGameId)
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.getVideoGameById(videoGameId)
            }
            throw ex
        }
    }

    async getVideoGameByName(videoGameName) {
        try {
            return await this.activeStore.getVideoGameByName(videoGameName)
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                this.onModeChange(this.mode)
                await this.switchToLocal(ex.message)
                return await this.getVideoGameByName(videoGameName)
            }
            throw ex
        }
    }

    async getVideoGameStatistics(request) {
        try {
            return this.activeStore.getVideoGameStatistics(request)
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.getVideoGameStatistics(request)
            }
            throw ex
        }
    }


    async getVideoGamesList(params) {
        let gamesPage
        try {
            gamesPage = await this.activeStore.getVideoGamesList(params)
        } catch (ex) {
            if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
                await this.switchToLocal(ex.message)
                return await this.getVideoGamesList(params)
            }
            throw ex
        }
        !this.crudHistory && (this.cachedVideoGamesList = [...gamesPage.items.map(vg => ({...vg}))])
        return gamesPage
    }

    _setupSubscribers() {
        this.remoteStore.addSubscriber('wrapper', (action, payload) => {
            Object.keys(this.subscribers).forEach(key => this.subscribers[key](action, payload))
        })
    }

    // noinspection JSUnusedLocalSymbols
    onModeChange = (mode, reason) => {
    }


}

export const videoGameStore = new WrapperVideoGameStore()
