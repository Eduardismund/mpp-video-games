import {describe, expect, test} from 'vitest'
import {
  addVideoGame,
  computeVideoGameId,
  deleteVideoGame,
  getVideoGameByName,
  getVideoGamesList,
  getVideoGameStatistics,
  updateVideoGame,
} from "../VideoGameStore.js";
import expectedVideoGames from "../video-games.json"
import {generateRandomVideoGame} from "./test-utils.js"

describe('VideoGameStore', () => {

  test("get all video games", async () => {
    const actualVideoGames = await getVideoGamesList({})

    expect(await Promise.all(actualVideoGames.map(async videoGame => await computeVideoGameId(videoGame.name))))
      .toEqual(actualVideoGames.map(videoGame => videoGame.id))
    expect(
      actualVideoGames.map(({name, genre, releaseDate, price, image}) => ({
        name, genre, releaseDate, price, image
      }))).toEqual(expectedVideoGames)
  })

  test("get video-games with price range", async () => {
    const actualVideoGames = await getVideoGamesList({minPrice: 10, maxPrice: 100})

    expect(await Promise.all(actualVideoGames.map(async videoGame => await computeVideoGameId(videoGame.name))))
      .toEqual(actualVideoGames.map(videoGame => videoGame.id))
    expect(actualVideoGames.map(({name, genre, releaseDate, price, image}) => ({
      name, genre, releaseDate, price, image
    }))).toEqual(expectedVideoGames.filter(videoGame => 10 <= videoGame.price && videoGame.price <= 100))

  })

  test("compute video id", async () => {
    const nameVariations = ["Dead By Daylight", "dead by daylight", "deadbydaylight", "    DEADBYDAYLIGHT    ", "@^#%@DEAD#&#&#&BY#&#&#DAYLIGHT"]
    const computedId = await computeVideoGameId(nameVariations[1])
    expect(computedId).toMatch(/^[a-f0-9]{8}$/g)

    const nameIds = await Promise.all(nameVariations.map(async videoGame => await computeVideoGameId(videoGame)))
    const distinctNameIds = new Set(nameIds)
    expect(distinctNameIds).length(1)
  })

  test("add video game", async () => {
    const initialVideoGames = await getVideoGamesList({})
    const newVideoGame = generateRandomVideoGame()

    await addVideoGame(newVideoGame);

    const listAfterAdd = await getVideoGamesList({})

    expect(initialVideoGames.length + 1).toBe(listAfterAdd.length)

    const videoGameId = await computeVideoGameId(newVideoGame.name)

    let foundVideoGame = listAfterAdd.find(videoGame => videoGame.id === videoGameId);
    expect(foundVideoGame).toEqual({...newVideoGame, id: videoGameId})
    expect(foundVideoGame).not.toBe(newVideoGame)
  })

  test("update video game successful", async () => {
    const videoGameNewState = generateRandomVideoGame();
    const videoGamesBeforeUpdate = await getVideoGamesList({})
    videoGameNewState.id = videoGamesBeforeUpdate[0].id

    await updateVideoGame(videoGameNewState)

    const videoGamesAfterUpdate = await getVideoGamesList({})

    const {
      id,
      name,
      genre,
      releaseDate,
      price
    } = videoGamesAfterUpdate.find(videoGame => videoGame.id === videoGameNewState.id);
    expect({id, name, genre, releaseDate, price}).toEqual({...videoGameNewState, name: videoGamesBeforeUpdate[0].name})
  })

  test("update video game id not found", async () => {
    const initialVideoGames = await getVideoGamesList({})
    const videoGameNewState = generateRandomVideoGame()
    videoGameNewState.id = "1234"

    await updateVideoGame(videoGameNewState)

    const videoGamesAfterUpdate = await getVideoGamesList({})

    expect(videoGamesAfterUpdate).toEqual(initialVideoGames)
  })

  test("update video game field is empty", async () => {
    const videoGameNewState = generateRandomVideoGame();
    const videoGames = await getVideoGamesList({})
    videoGameNewState.id = videoGames[0].id
    videoGameNewState.genre = ""

    await updateVideoGame(videoGameNewState)

    const videoGamesAfterUpdate = await getVideoGamesList({})

    const {genre} = videoGamesAfterUpdate.find(videoGame => videoGame.id === videoGameNewState.id);
    expect(genre).not.toEqual(videoGameNewState.genre)
    expect(genre).toEqual(videoGames[0].genre)
  })

  test("delete video game", async () => {
    const videoGames = await getVideoGamesList({})
    const videoGameIdToDelete = videoGames[0].id

    await deleteVideoGame(videoGameIdToDelete)

    const videoGamesAfterDelete = await getVideoGamesList({})

    const videoGameDeleted = videoGamesAfterDelete.find(videoGame => videoGame.id === videoGameIdToDelete);
    expect(videoGameDeleted).toBe(undefined)
    expect(videoGamesAfterDelete.length + 1).toEqual(videoGames.length)
  })


  test("get video game by name", async () => {
    const videoGameName = "CSGO"

    const videoGame = await getVideoGameByName(videoGameName)
    expect(videoGame.name).toEqual(videoGameName)
  })

  test("get video-games with offset", async () => {
    const allVideoGames = await getVideoGamesList({})
    const offset = 2

    const actualVideoGames = await getVideoGamesList({ offset })

    expect(actualVideoGames).toEqual(allVideoGames.slice(offset))
  })

  test("get video-games with maxItems", async () => {
    const allVideoGames = await getVideoGamesList({})
    const maxItems = 3

    const actualVideoGames = await getVideoGamesList({ maxItems })

    expect(actualVideoGames.length).toBeLessThanOrEqual(maxItems)
    expect(actualVideoGames).toEqual(allVideoGames.slice(0, maxItems))
  })

  test("get video-games with offset and maxItems", async () => {
    const allVideoGames = await getVideoGamesList({})
    const offset = 1
    const maxItems = 3

    const actualVideoGames = await getVideoGamesList({ offset, maxItems })

    expect(actualVideoGames).toEqual(allVideoGames.slice(offset, offset + maxItems))
  })


  test('get statistics price metrics', async () => {
    const {priceMetrics} = await getVideoGameStatistics({
      priceMetrics: {
        min: true,
        max: true,
        percentiles: [10, 40, 60, 90]
      }
    })
    expect(priceMetrics?.min).toBeGreaterThanOrEqual(0)
    expect(priceMetrics?.max).toBeGreaterThanOrEqual(0)
    expect(priceMetrics?.percentiles?.length).toBe(4)
    expect(priceMetrics?.percentiles?.map(({p}) => p)).toEqual([10, 40, 60, 90])
    priceMetrics?.percentiles?.map(({v}) => v).forEach(v => expect(v).toBeGreaterThanOrEqual(0))
  })
  test('get statistics no request', async () => {
    expect(await getVideoGameStatistics({})).toEqual({})
    expect(await getVideoGameStatistics({priceMetrics: {}})).toEqual({priceMetrics: {}})
    expect(await getVideoGameStatistics({
      priceMetrics: {
        min: false,
        max: false,
        percentiles: []
      }
    })).toEqual({priceMetrics: {percentiles: []}})
  })
})
