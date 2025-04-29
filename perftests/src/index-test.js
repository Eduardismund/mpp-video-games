import http from 'k6/http';
import {check} from 'k6';
import {generateSingularVideoGame, generateSingularVideoGameReview} from './data-generator-fn.js'
import genreListJson from "../../frontend/src/genre.json" with {type: "json"};
import {Counter} from 'k6/metrics';
import {SharedArray} from "k6/data";

const createdVideoGamesCount = new Counter('createdVideoGamesCounter');
const createdVideoGameConflictsCount = new Counter('createdVideoGameConflictsCount');

const urlBase = `${__ENV.BASE_URL}`


/**
 *
 * @type {import('k6/options').Options}
 */
export const options = {
  vus: 10,
  iterations: 1000,
  duration: '60m',
  // rps: 10,
  thresholds: {
    'http_req_duration{type:getVideoGameList}': ['p(95)<1000'],
    'http_req_duration{type:createVideoGame}': ['p(95)<1000'],
    'http_req_duration{type:createVideoGameReview}': ['p(95)<1000'],
    'http_req_duration{type:getStatisticVideoGames}': ['p(95)<1000']
  },
}

const tokens = new SharedArray('tokens', () => {
  return JSON.parse(open('../data/tokens.json'));
});


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function variousOps() {
  switch(__ITER%4){
    case 0:
      getVideoGamesList()
      break
    case 1:
    case 3:
     generateData()
      break
    case 2:
      getStaticsVideoGame()
      break
  }
}

function generateData(){
  const videoGameId = createVideoGame()
  if (videoGameId) {
    let reviews = getRandomInt(0, 20)
    while (reviews > 0) {
      createVideoGameReview({videoGameId, index: reviews})
      reviews--
    }
  }
}

export default function () {
  if (__ENV.TEST_FUNCTION === 'generateData') {
    generateData();
  } else {
    variousOps()
  }
}

function createVideoGame() {
  const genres = genreListJson
  const {token} = tokens[__ITER%(tokens.length)]
  const res = http.post(`${urlBase}/api/video-games`,
    JSON.stringify(generateSingularVideoGame({genres})), {
      headers: {'Content-Type': 'application/json', "Authorization": token}, tags: {type: "createVideoGame"}
    })
  if (res.status === 201) {
    createdVideoGamesCount.add(1)
  }
  if (res.status === 409) {
    createdVideoGameConflictsCount.add(1)
  }
  check(res, {'video game create ok': (r) => r.status === 201 || r.status === 409});

  return res.json("id")

}

/**
 *
 * @param {string} videoGameId
 * @param index
 */
function createVideoGameReview({videoGameId, index}) {
  const {token} = tokens[(__ITER+index)%(tokens.length)]
  const res = http.post(`${urlBase}/api/video-games/${videoGameId}/reviews`,
    JSON.stringify(generateSingularVideoGameReview()), {
      headers: {'Content-Type': 'application/json', "Authorization": token}, tags: {type: "createVideoGameReview"}
    })
  check(res, {'video game review create ok': (r) => r.status === 201});
}

function getStaticsVideoGame() {
  const res = http.post(`${urlBase}/api/video-games/statistics`,
    JSON.stringify({
      "priceMetrics": {"percentiles": [10, 40, 60, 90]},
      "genrePopularity": 3,
      "releaseYears": true,
      "totalCount": true
    }), {
      headers: {'Content-Type': 'application/json'}, tags: {type: "getStatisticVideoGames"}
    })
  check(res, {'video game statistics list ok': (r) => r.status === 200});
}

function getVideoGamesList() {
  const res = http.get(`${urlBase}/api/video-games?minPrice=10&maxPrice=90&offset=100&maxItems=50`, {
    tags: {type: "getVideoGameList"}
  })
  check(res, {'video game list get ok': (r) => r.status === 200});
}
