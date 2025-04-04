import express from 'express';
import cors from 'cors';
import {initVideoGameValidators, validateVideoGame} from "../VideoGameValidators.js";
import {extractProperties} from "../utils.js";
import {newLocalVideoGameStore} from "../LocalVideoGameStore.js";

const app = express();
const PORT = 5000;
const store = newLocalVideoGameStore()
initVideoGameValidators({
  getVideoGameByName: async (name) => await store.getVideoGameByName(name),
  getGenreList: async() => await store.getGenreList()
})

// Middleware
app.use(express.json());
app.use(cors());

const featureToggles = {
  subscriptions: true
}

app.post('/api/feature-toggles', (req, res) => {
  try {
    featureToggles.subscriptions = req.body?.subscriptions
    res.status(200).json(featureToggles);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
})


app.get('/api/video-games/subscriptions', (req, res) => {
  if (!featureToggles.subscriptions) {
    res.status(500).json({error: 'Subscriptions are off'})
    return
  }
  const subscriberKey = crypto.randomUUID();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  store.addSubscriber(subscriberKey, (action, payload) => {
    res.write(`event: ${action}\n`);
    res.write(`id: ${crypto.randomUUID()}\n`);
    res.write(`data: ${JSON.stringify({action, payload})}\n\n`)
  })

  const interval = setInterval(() => {
    if (featureToggles.subscriptions) {
      res.write('event: ping\n')
      res.write(`id: ${crypto.randomUUID()}\n`)
      res.write(`data: ${JSON.stringify({datetime: new Date().toISOString()})}\n\n`)
    }
  }, 1000)


  req.on('close', () => {
    clearInterval(interval)
    store.removeSubscriber(subscriberKey);
    console.log(`Client ${subscriberKey} disconnected`);
    res.end();
  });
});

// CREATE a new game
app.post('/api/video-games', async (req, res) => {
  try {
    const errors = await validateVideoGame(req.body, 'create')
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({errors: errors})
    }
    const id = await store.addVideoGame(extractProperties(req.body, {
      name: 'string',
      genre: 'string',
      releaseDate: 'string',
      price: 'number'
    }))
    res.status(201).json({id});
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

app.post('/api/video-games/statistics', async (req, res) => {
  try {
    const statistics = await store.getVideoGameStatistics(req.body)
    res.status(200).json(statistics);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

// READ all games
app.get('/api/video-games', async (req, res) => {


  try {

    const params = extractProperties(req.query, {
      minPrice: 'number',
      maxPrice: 'number',
      offset: 'number',
      maxItems: 'number',
      nameEq: 'string'
    });
    const games = await store.getVideoGamesList(params)
    res.json(games);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

app.get('/api/genres', async (req, res) => {
  try {
    const genres = await store.getGenreList()
    res.json(genres);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

// READ a single game by ID
app.get('/api/video-games/:id', async (req, res) => {
  try {
    const game = await store.getVideoGameById(req.params.id)
    if (!game) return res.status(404).json({message: 'Game not found'});
    res.json(game);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

// UPDATE a game by ID
app.patch('/api/video-games/:id', async (req, res) => {
  try {

    if (!await store.getVideoGameById(req.params.id)) return res.status(404).json({message: 'Game not found'});
    const errors = await validateVideoGame(req.body, 'update')
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({errors: errors})
    }
    await store.updateVideoGame({
      ...extractProperties(req.body, {
        name: 'string',
        genre: 'string',
        releaseDate: 'string',
        price: 'number'
      }), id: req.params.id
    })

    res.status(204).send();
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

// DELETE a game by ID
app.delete('/api/video-games/:id', async (req, res) => {
  try {
    if (!await store.getVideoGameById(req.params.id)) return res.status(404).json({message: 'Game not found'});

    await store.deleteVideoGame(req.params.id)
    res.status(204).send();
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app


