import express from 'express';
import cors from 'cors';
import {
  addSubscriber,
  addVideoGame,
  deleteVideoGame,
  getVideoGameById,
  getVideoGamesList,
  getVideoGameStatistics,
  removeSubscriber,
  updateVideoGame,
  getVideoGameByName
} from "../VideoGameStore.js";
import {initVideoGameValidators, validateVideoGame} from "../VideoGameValidators.js";
import {extractProperties} from "../utils.js";
import {getGenreList} from "../GenreStore.js";

const app = express();
const PORT = 5000;

initVideoGameValidators({getVideoGameByName, getGenreList})

// Middleware
app.use(express.json());
app.use(cors());

app.get('/api/video-games/subscriptions', (req, res) => {
  const subscriberKey = crypto.randomUUID();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  addSubscriber(subscriberKey, (action, payload) => {
    res.write(`event: ${action}\n`);
    res.write(`id: ${crypto.randomUUID()}\n`);
    res.write(`data: ${JSON.stringify({action, payload})}\n\n`)
  })
  req.on('close', () => {
    removeSubscriber(subscriberKey);
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
    const id = await addVideoGame(extractProperties(req.body, {
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
    const statistics = await getVideoGameStatistics(req.body)
    res.status(200).json(statistics);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

// READ all games
app.get('/api/video-games', async (req, res) => {


  try {
    /**
     *
     * @type {any}
     */
    const params = extractProperties(req.query, {
      minPrice: 'number',
      maxPrice: 'number',
      offset: 'number',
      maxItems: 'number',
      nameEq: 'string'
    });
    const games = await getVideoGamesList(params)
    res.json(games);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});

// READ a single game by ID
app.get('/api/video-games/:id', async (req, res) => {
  try {
    const game = await getVideoGameById(req.params.id)
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

    if (!await getVideoGameById(req.params.id)) return res.status(404).json({message: 'Game not found'});
    const errors = await validateVideoGame(req.body, 'update')
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({errors: errors})
    }
    await updateVideoGame({
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
    if (!await getVideoGameById(req.params.id)) return res.status(404).json({message: 'Game not found'});

    await deleteVideoGame(req.params.id)
    res.status(204).send();
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message});
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app


