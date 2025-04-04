import {beforeEach, describe, expect, it} from 'vitest'
import {EventSource} from 'eventsource'
import supertest from 'supertest';
import app from '../backend/backend.js'


const request = supertest(app)
const {
  getVideoGamesList,
  getVideoGameById,
  getVideoGameByName,
  updateVideoGame,
  deleteVideoGame,
  addVideoGame,
  getVideoGameStatistics,
  addSubscriber,
  removeSubscriber,
  getGenreList
} = vi.hoisted(() => {
  return {
    getVideoGamesList: vi.fn(),
    getVideoGameById: vi.fn(),
    getVideoGameByName: vi.fn(),
    updateVideoGame: vi.fn(),
    deleteVideoGame: vi.fn(),
    addVideoGame: vi.fn(),
    getVideoGameStatistics: vi.fn(),
    addSubscriber: vi.fn(),
    removeSubscriber: vi.fn(),
    getGenreList: vi.fn()
  }
})

// noinspection JSUnusedGlobalSymbols
vi.mock('../LocalVideoGameStore.js', () => ({
  newLocalVideoGameStore: () => ({
    getVideoGamesList,
    getVideoGameById,
    getVideoGameByName,
    updateVideoGame,
    deleteVideoGame,
    addVideoGame,
    getVideoGameStatistics,
    addSubscriber,
    removeSubscriber,
    getGenreList
  })
}))


describe('GET /api/video-games', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('should return the video games list', async () => {
    const fakeVideoGame = {
      name: 'testName', genre: 'fakeGenre', releaseDate: 'fakeReleaseDate', price: '1', id: '1'
    }

    getVideoGamesList.mockImplementation(() => ({items: [fakeVideoGame], totalCount: 1}))
    const response = await request.get('/api/video-games');
    expect(response.status).toBe(200)
    expect(response.body).toEqual({items: [fakeVideoGame], totalCount: 1})
  })

  it('should return 500 on error', async () => {
    getVideoGamesList.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request.get('/api/video-games');
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error: 'test error'})
  })

  it('should extract parameters from request query', async () => {
    const response = await request.get('/api/video-games?minPrice=10&maxPrice=100&offset=0&maxItems=1&nameEq=test&time=1')
    expect(response.status).toBe(200)
    expect(getVideoGamesList).toHaveBeenCalledWith({
      minPrice: 10, maxPrice: 100, offset: 0, maxItems: 1, nameEq: 'test'
    })
  })
})

describe('GET /api/video-game/:id', () => {
  it('should return the corresponding video game', async () => {
    const fakeVideoGame = {
      name: 'testName', genre: 'fakeGenre', releaseDate: 'fakeReleaseDate', price: '1', id: '1'
    }

    getVideoGameById.mockImplementation((id) => {
      if (id === '1') {
        return fakeVideoGame
      }
      return undefined
    })

    const response = await request.get('/api/video-games/1');

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(fakeVideoGame)
  })

  it('should return message when not found', async () => {
    getVideoGameById.mockImplementation(() => undefined)


    const response = await request.get('/api/video-games/1');

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({message: 'Game not found'})
  })

  it('should return 500 on error', async () => {
    getVideoGameById.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request.get('/api/video-games/1');
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error: 'test error'})
  })
})

describe('PATCH /api/video-game/:id', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('should return message when not found', async () => {
    getVideoGameById.mockImplementation(() => undefined)

    const response = await request.patch('/api/video-games/1');

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({message: 'Game not found'})
  })

  it('should return 400 if validation errors are present', async () => {
    const fakeVideoGame = {
      name: 'testName', genre: 'fakeGenre', releaseDate: 'fakeReleaseDate', price: '1', id: '1'
    }
    getVideoGameById.mockImplementation(() => fakeVideoGame);
    getGenreList.mockImplementation(() => ['Adventure'])


    const response = await request.patch('/api/video-games/1').send({
      name: '', genre: 'Adventure', releaseDate: '2022-01-01', price: 'invalidPrice',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual({
      price: ['The price is not valid'],
    });
  });

  it('should update video game', async () => {
    const fakeVideoGame = {
      name: 'testName', genre: 'fakeGenre', releaseDate: 'fakeReleaseDate', price: '1', id: '1'
    }

    getVideoGameById.mockImplementation(() => fakeVideoGame)
    getGenreList.mockImplementation(() => ['Adventure'])

    const response = await request.patch('/api/video-games/1').send({
      name: '', genre: 'Adventure', releaseDate: '2022-01-01', price: '12.12',
    });

    expect(response.status).toEqual(204)
    expect(updateVideoGame).toHaveBeenCalledWith({
      id: '1', name: '', genre: 'Adventure', releaseDate: '2022-01-01', price: 12.12,
    })
  })
  it('should return 500 on error', async () => {
    getVideoGameById.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request.patch('/api/video-games/1');
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error: 'test error'})
  })
})

describe('DELETE /api/video-games/:id', () => {
  it('should return message when not found', async () => {
    getVideoGameById.mockImplementation(() => undefined)
    const response = await request.delete('/api/video-games/1')

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({message: 'Game not found'})
  })

  it('should delete video game', async () => {
    const fakeVideoGame = {
      name: 'testName', genre: 'fakeGenre', releaseDate: 'fakeReleaseDate', price: '1', id: '1'
    }
    getVideoGameById.mockImplementation(() => fakeVideoGame)
    const response = await request.delete('/api/video-games/1')

    expect(deleteVideoGame).toHaveBeenCalledWith("1")
    expect(response.status).toEqual(204)
  })

  it('should return 500 on error', async () => {
    getVideoGameById.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request.delete('/api/video-games/1');
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error: 'test error'})
  })
})

describe('POST /api/video-games/:id', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 if validation errors are present', async () => {
    getGenreList.mockImplementation(() => ['Adventure'])


    const response = await request.post('/api/video-games').send({
      name: '', genre: 'Adventure', releaseDate: '2022-01-01', price: 'invalidPrice',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual({
      name: ['This field is required'], price: ['The price is not valid'],
    });
  });

  it('should add video game', async () => {

    getGenreList.mockImplementation(() => ['Adventure'])

    const response = await request.post('/api/video-games').send({
      name: 'testName', genre: 'Adventure', releaseDate: '2022-01-01', price: '12.12',
    });

    expect(response.status).toEqual(201)
    expect(addVideoGame).toHaveBeenCalledWith({
      name: 'testName', genre: 'Adventure', releaseDate: '2022-01-01', price: 12.12,
    })
  })
  it('should return 500 on error', async () => {
    const response = await request.post('/api/video-games');
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error: 'Cannot convert undefined or null to object'})
  })

})

describe('POST /api/video-games/statistics', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });


  it('should create statistics', async () => {
    const statTest = {
      priceMetrics: {
        min: true, max: false, percentiles: [10, 25, 50, 75, 90]
      }, genrePopularity: 3, releaseYears: true, totalCount: false
    };

    getVideoGameStatistics.mockImplementation(() => statTest)

    const response = await request.post('/api/video-games/statistics').send(statTest);

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(statTest)
  })

  it('should return 500 on error', async () => {
    getVideoGameStatistics.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request.post('/api/video-games/statistics');
    expect(response.status).toBe(500)
    expect(response.body).toEqual({error: 'test error'})
  })

})

describe('GET /api/video-games/subscriptions', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should stream events to the client', async () => {
      const testAction = 'action'
      const testPayload = {message: 'test'}


      addSubscriber.mockImplementation((subKey, callback) =>
        setTimeout(() => callback(testAction, testPayload), 100)
      )
      const server = app.listen(0)
      const source = new EventSource(`http://localhost:${server.address().port}/api/video-games/subscriptions`);
      const evt = await new Promise(resolve => {
        source.addEventListener(testAction, resolve)
      })
      source.close()
      await new Promise(resolve => server.close(resolve))
      expect(evt.data).toEqual('{"action":"action","payload":{"message":"test"}}')
    }
  )
})
