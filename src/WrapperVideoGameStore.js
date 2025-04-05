import {newRemoteVideoGameStore} from "./RemoteVideoGameStore.js";
import {newLocalVideoGameStore} from "./LocalVideoGameStore.js";

/**
 * @implements {VideoGameStore}
 */
class WrapperVideoGameStore {
  /**
   *
   * @type {{[string]: videoGameSubscriber}}
   */
  subscribers = {}
  videoGameStore = newRemoteVideoGameStore()
  /**
   *
   * @type {string[]}
   */
  cachedGenresList = []
  /**
   *
   * @type {VideoGame[]}
   */
  cachedVideoGamesList = []

  /**
   *
   * @type {{action: 'create' | 'update' | 'delete', payload?: Partial<VideoGame>}[]}
   */
  crudHistory = undefined

  get mode() {
    return this.crudHistory ? 'local' : 'remote'
  }

  constructor() {
    this._setupSubscribers()
  }

  async switchToLocal() {
    this.videoGameStore = newLocalVideoGameStore({
      videoGameList: this.cachedVideoGamesList,
      genreList: this.cachedGenresList
    })
    this._setupSubscribers()
    this.crudHistory = []
    console.log('switched to mode', this.mode)
    this.onModeChange(this.mode)
  }

  async switchToRemote() {
    this.videoGameStore = newRemoteVideoGameStore()
    this._setupSubscribers()
    for (let step of this.crudHistory) {
      switch (step.action) {
        case "create":
          await this.videoGameStore.addVideoGame(step.payload)
          break
        case "update":
          await this.videoGameStore.updateVideoGame(step.payload)
          break
        case "delete":
          await this.videoGameStore.deleteVideoGame(step.payload.id)
      }
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
      const newId = await this.videoGameStore.addVideoGame(videoGame);
      this.crudHistory?.push({action: 'create', payload: videoGame})
      return newId
    } catch (ex) {
      console.log(ex.response)
      throw ex
    }
  }


  async updateVideoGame(videoGame) {
    await this.videoGameStore.updateVideoGame(videoGame)
    this.crudHistory?.push({action: 'update', payload: videoGame})
  }


  async deleteVideoGame(videoGameId) {
    await this.videoGameStore.deleteVideoGame(videoGameId)
    this.crudHistory?.push({action: 'delete', payload: {id: videoGameId}})
  }


  computeVideoGameId(videoGameName) {
    return this.videoGameStore.computeVideoGameId(videoGameName)
  }

  async getGenreList() {
    const genres = await this.videoGameStore.getGenreList()
    !this.crudHistory && (this.cachedGenresList = [...genres])
    return genres
  }

  getVideoGameById(videoGameId) {
    return this.videoGameStore.getVideoGameById(videoGameId)
  }

  async getVideoGameByName(videoGameName) {
    try {
      return await this.videoGameStore.getVideoGameByName(videoGameName)
    } catch (ex) {
      if (ex.message === 'ERR_NET' || ex.message === 'ERR_SERVER') {
        await this.switchToLocal()
        return await this.getVideoGameByName(videoGameName)
      }
      throw ex
    }
  }

  getVideoGameStatistics(request) {
    return this.videoGameStore.getVideoGameStatistics(request)
  }

  async getVideoGamesList(params) {
    const gamesPage = await this.videoGameStore.getVideoGamesList(params)
    !this.crudHistory && (this.cachedVideoGamesList = [...gamesPage.items.map(vg => ({...vg}))])
    return gamesPage
  }

  _setupSubscribers() {
    this.videoGameStore.addSubscriber('wrapper', (action, payload) => {
      Object.keys(this.subscribers).forEach(key => this.subscribers[key](action, payload))
    })
  }

  onModeChange = (_) => {
  }
}

export const videoGameStore = new WrapperVideoGameStore()
