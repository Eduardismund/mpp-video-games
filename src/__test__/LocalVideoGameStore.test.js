import {describe, expect, test} from 'vitest'
import {newLocalVideoGameStore,} from "../LocalVideoGameStore.js";
import {generateRandomVideoGame} from "./test-utils.js"

describe('LocalVideoGameStore', () => {

  /**
   *
   * @type {VideoGame[]}
   */
  const expectedVideoGames = [
    {
      "name": "Dead by Daylight",
      "genre": "Horror",
      "releaseDate": "2016-06-14",
      "price": 29.99,
      "image": "https://image.jpg"
    },
    {
      "name": "CSGO",
      "genre": "First-Person Shooter",
      "releaseDate": "2012-08-21",
      "price": 14.99,
      "image": "https:/image.png"
    }
  ]

  const expectedGenreList = ["Horror", "First-Person Shooter"]


  const subject = newLocalVideoGameStore({
    videoGameList: expectedVideoGames.map(vg => ({...vg})),
    genreList: [...expectedGenreList]
  })

  test("can load from jsons", async () => {
    const localSubject = newLocalVideoGameStore({})
    expect((await localSubject.getGenreList()).length).toBeGreaterThan(2)
    expect((await localSubject.getVideoGamesList({})).items.length).toBeGreaterThan(2)
  })

  test("get all video games", async () => {
    const actualVideoGames = await subject.getVideoGamesList({})

    expect(await Promise.all(actualVideoGames.items.map(async videoGame => await subject.computeVideoGameId(videoGame.name))))
      .toEqual(actualVideoGames.items.map(videoGame => videoGame.id))
    expect(
      actualVideoGames.items.map(({name, genre, releaseDate, price, image}) => ({
        name, genre, releaseDate, price, image
      }))).toEqual(expectedVideoGames)

    expect(actualVideoGames.totalCount).toEqual(expectedVideoGames.length)
  })

  test("get video-games with price range", async () => {
    const actualVideoGames = await subject.getVideoGamesList({minPrice: 10, maxPrice: 100})

    expect(await Promise.all(actualVideoGames.items.map(async videoGame => await subject.computeVideoGameId(videoGame.name))))
      .toEqual(actualVideoGames.items.map(videoGame => videoGame.id))
    expect(actualVideoGames.items.map(({name, genre, releaseDate, price, image}) => ({
      name, genre, releaseDate, price, image
    }))).toEqual(expectedVideoGames.filter(videoGame => 10 <= videoGame.price && videoGame.price <= 100))

  })

  test("compute video id", async () => {
    const nameVariations = ["Dead By Daylight", "dead by daylight", "deadbydaylight", "    DEADBYDAYLIGHT    ", "@^#%@DEAD#&#&#&BY#&#&#DAYLIGHT"]
    const computedId = await subject.computeVideoGameId(nameVariations[1])
    expect(computedId).toMatch(/^[a-f0-9]{8}$/g)

    const nameIds = await Promise.all(nameVariations.map(async videoGame => await subject.computeVideoGameId(videoGame)))
    const distinctNameIds = new Set(nameIds)
    expect(distinctNameIds).length(1)
  })

  test("add video game", async () => {
    const initialVideoGames = await subject.getVideoGamesList({})
    const newVideoGame = generateRandomVideoGame()

    await subject.addVideoGame(newVideoGame);

    const listAfterAdd = await subject.getVideoGamesList({})

    expect(initialVideoGames.items.length + 1).toBe(listAfterAdd.items.length)

    const videoGameId = await subject.computeVideoGameId(newVideoGame.name)

    let foundVideoGame = listAfterAdd.items.find(videoGame => videoGame.id === videoGameId);
    expect(foundVideoGame).toEqual({...newVideoGame, id: videoGameId})
    expect(foundVideoGame).not.toBe(newVideoGame)
  })

  test("update video game successful", async () => {
    const videoGameNewState = generateRandomVideoGame();
    const videoGamesBeforeUpdate = await subject.getVideoGamesList({})
    videoGameNewState.id = videoGamesBeforeUpdate.items[0].id

    await subject.updateVideoGame(videoGameNewState)

    const videoGamesAfterUpdate = await subject.getVideoGamesList({})

    const {
      id,
      name,
      genre,
      releaseDate,
      price
    } = videoGamesAfterUpdate.items.find(videoGame => videoGame.id === videoGameNewState.id);
    expect({id, name, genre, releaseDate, price}).toEqual({
      ...videoGameNewState,
      name: videoGamesBeforeUpdate.items[0].name
    })
  })

  test("update video game id not found", async () => {
    const initialVideoGames = await subject.getVideoGamesList({})
    const videoGameNewState = generateRandomVideoGame()
    videoGameNewState.id = "1234"

    await subject.updateVideoGame(videoGameNewState)

    const videoGamesAfterUpdate = await subject.getVideoGamesList({})

    expect(videoGamesAfterUpdate).toEqual(initialVideoGames)
  })

  test("update video game field is empty", async () => {
    const videoGameNewState = generateRandomVideoGame();
    const videoGames = await subject.getVideoGamesList({})
    videoGameNewState.id = videoGames.items[0].id
    videoGameNewState.genre = ""

    await subject.updateVideoGame(videoGameNewState)

    const videoGamesAfterUpdate = await subject.getVideoGamesList({})

    const {genre} = videoGamesAfterUpdate.items.find(videoGame => videoGame.id === videoGameNewState.id);
    expect(genre).not.toEqual(videoGameNewState.genre)
    expect(genre).toEqual(videoGames.items[0].genre)
  })

  test("delete video game", async () => {
    const videoGames = await subject.getVideoGamesList({})
    const videoGameIdToDelete = videoGames.items[0].id

    await subject.deleteVideoGame(videoGameIdToDelete)

    const videoGamesAfterDelete = await subject.getVideoGamesList({})

    const videoGameDeleted = videoGamesAfterDelete.items.find(videoGame => videoGame.id === videoGameIdToDelete);
    expect(videoGameDeleted).toBe(undefined)
    expect(videoGamesAfterDelete.items.length + 1).toEqual(videoGames.items.length)
  })


  test("get video game by name", async () => {
    const videoGameName = "CSGO"

    const videoGame = await subject.getVideoGameByName(videoGameName)
    expect(videoGame.name).toEqual(videoGameName)
  })

  test("get video-games with offset", async () => {
    const allVideoGames = await subject.getVideoGamesList({})
    const offset = 2

    const actualVideoGames = await subject.getVideoGamesList({offset})

    expect(actualVideoGames.items).toEqual(allVideoGames.items.slice(offset))
  })

  test("get video-games with maxItems", async () => {
    const allVideoGames = await subject.getVideoGamesList({})
    const maxItems = 3

    const actualVideoGames = await subject.getVideoGamesList({maxItems})

    expect(actualVideoGames.items.length).toBeLessThanOrEqual(maxItems)
    expect(actualVideoGames.items).toEqual(allVideoGames.items.slice(0, maxItems))
  })

  test("get video-games with offset and maxItems", async () => {
    const allVideoGames = await subject.getVideoGamesList({})
    const offset = 1
    const maxItems = 3

    const actualVideoGames = await subject.getVideoGamesList({offset, maxItems})

    expect(actualVideoGames.items).toEqual(allVideoGames.items.slice(offset, offset + maxItems))
  })


  test('get statistics price metrics', async () => {
    const {priceMetrics} = await subject.getVideoGameStatistics({
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
    expect(await subject.getVideoGameStatistics({})).toEqual({})
    expect(await subject.getVideoGameStatistics({priceMetrics: {}})).toEqual({priceMetrics: {}})
    expect(await subject.getVideoGameStatistics({
      priceMetrics: {
        min: false,
        max: false,
        percentiles: []
      }
    })).toEqual({priceMetrics: {percentiles: []}})
  })

  test("get genre list", async () => {
    const actualGenres = await subject.getGenreList()
    expect(actualGenres).toEqual(expectedGenreList)
  })
})
