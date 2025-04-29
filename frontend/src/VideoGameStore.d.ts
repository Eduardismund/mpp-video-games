interface VideoGame {
  id: string
  name: string
  genre: string
  releaseDate: string
  price: number
  image?: string
}

interface VideoGameReview{
  id: string
  text?: string
  score: number
  timestamp: string
}

interface VideoGameListPage {
  items: VideoGame[]
  totalCount: number
}

interface Metrics {
  min?: number
  max?: number
  percentiles?: { p: number, v: number }[]
}

interface StatisticsRqPriceMetrics {
  min?: boolean
  max?: boolean
  percentiles?: number[]
}

interface StatisticsRq {
  priceMetrics?: StatisticsRqPriceMetrics
  genrePopularity?: number
  releaseYears?: boolean
  totalCount?: boolean
}

interface StatisticsRs {
  priceMetrics?: Metrics
  totalCount?: number
  genrePopularity?: PopularGenre[]
  releaseYears?: ReleaseYear[]
}

interface PopularGenre {
  genre: string
  count: number
}

interface ReleaseYear {
  year: number
  count: number
}

interface VideoGameListParams {
  nameEq?: string
  minPrice?: number
  maxPrice?: number
  offset?: number
  maxItems?: number
}

type videoGameSubscriber = (action: 'create' | 'delete' | 'update', payload: any) => void


interface VideoGameStore {

  computeVideoGameId(videoGameName: string): Promise<string>

  addVideoGame(videoGame: Partial<VideoGame>): Promise<string>

  updateVideoGame(videoGame: Partial<VideoGame>): Promise<void>

  deleteVideoGame(videoGameId: string): Promise<void>

  getVideoGamesList(params: VideoGameListParams): Promise<VideoGameListPage>

  getVideoGameByName(videoGameName: string): Promise<VideoGame | undefined>

  getVideoGameStatistics(request: StatisticsRq): Promise<StatisticsRs>

  getVideoGameById(videoGameId: string): Promise<VideoGame | undefined>

  addSubscriber(key: string, subscriber: videoGameSubscriber): void

  removeSubscriber(key: string): void

  getGenreList(): Promise<string[]>
}
