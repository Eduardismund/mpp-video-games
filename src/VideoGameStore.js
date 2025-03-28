/**
 * @typedef {Object} VideoGame
 * @property {string} id
 * @property {string} name
 * @property {string} genre
 * @property {string} releaseDate
 * @property {number} price
 */

import * as CRC32 from "crc-32";

/**
 *
 * @type VideoGame[]
 */
const videoGamesList = [
  {
    id: _computeVideoGameId("Dead by Daylight"),
    name: "Dead by Daylight",
    genre: "Horror",
    releaseDate: '2016-06-14',
    price: 29.99,
    image: "https://upload.wikimedia.org/wikipedia/en/1/1b/Dead_by_Daylight_logo.jpg"
  },
  {
    id: _computeVideoGameId("CSGO"),
    name: "CSGO",
    genre: "First-Person Shooter",
    releaseDate: '2012-08-21',
    price: 14.99,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Counter-Strike_Global_Offensive_logo.svg/1200px-Counter-Strike_Global_Offensive_logo.svg.png"
  },
  {
    id: _computeVideoGameId("Witch it"),
    name: "Witch It",
    genre: "Survival / Multiplayer",
    releaseDate: '2017-07-20',
    price: 19.99,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Witch_It_Logo.png/1200px-Witch_It_Logo.png"
  },
  {
    id: _computeVideoGameId("Apex Legends"),
    name: "Apex Legends",
    genre: "Battle Royale",
    releaseDate: '2019-02-04',
    price: 0.00,  // Free to play
    image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Apex_Legends_logo.png"
  },
  {
    id: _computeVideoGameId("The Witcher 3"),
    name: "The Witcher 3: Wild Hunt",
    genre: "Action RPG",
    releaseDate: '2015-05-19',
    price: 39.99,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/The_Witcher_3_Wild_Hunt_logo.jpg"
  },
  {
    id: _computeVideoGameId("Minecraft"),
    name: "Minecraft",
    genre: "Sandbox",
    releaseDate: '2011-11-18',
    price: 26.95,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Minecraft_logo.png"
  },
  {
    id: _computeVideoGameId("Cyberpunk 2077"),
    name: "Cyberpunk 2077",
    genre: "RPG",
    releaseDate: '2020-12-10',
    price: 59.99,
    image: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg"
  },
  {
    id: _computeVideoGameId("Overwatch"),
    name: "Overwatch",
    genre: "First-Person Shooter",
    releaseDate: '2016-05-24',
    price: 39.99,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Overwatch_logo_2019.svg"
  },
  {
    id: _computeVideoGameId("Red Dead Redemption 2"),
    name: "Red Dead Redemption 2",
    genre: "Action-Adventure",
    releaseDate: '2018-10-26',
    price: 59.99,
    image: "https://upload.wikimedia.org/wikipedia/en/d/d4/Red_Dead_Redemption_2_cover_art.jpg"
  },
  {
    id: _computeVideoGameId("Fortnite"),
    name: "Fortnite",
    genre: "Battle Royale",
    releaseDate: '2017-09-26',
    price: 0.00,  // Free to play
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Fortnite_Logo.png"
  }
];

/**
 * @returns {Promise<VideoGame[]>}
 */
export function getVideoGamesList() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...videoGamesList]), 500)
  });
}

/**
 *
 * @param {string} videoGameName
 * @returns {string}
 * @private
 */
function _computeVideoGameId(videoGameName) {
  return (CRC32.str(videoGameName.replaceAll(/[^a-zA-Z0-9]/g, "").toLowerCase()) >>> 0).toString(16)
}

/**
 *
 * @param {string} videoGameName
 * @returns {Promise<string>}
 */
export function computeVideoGameId(videoGameName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_computeVideoGameId(videoGameName))
    }, 500)
  })
}

/**
 * @param {Partial<VideoGame>} videoGame
 * @returns {Promise<string>}
 */
export function addVideoGame(videoGame) {
  return computeVideoGameId(videoGame.name)
    .then(id => {
      videoGamesList.push({...videoGame, id})
      return id;
    })
}

/**
 *
 * @param videoGame
 * @returns {Promise<void>}
 */
export async function updateVideoGame(videoGame) {
  const foundVideoGame = await getVideoGameById(videoGame.id)
  foundVideoGame && Object.keys(videoGame).forEach(key => {
    if (videoGame[key] !== '' && key !== name) {
      foundVideoGame[key] = videoGame[key];
    }
  })
}

/**
 *
 * @param {string} videoGameId
 * @returns {Promise<void>}
 */
export function deleteVideoGame(videoGameId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = videoGamesList.findIndex(game => game.id === videoGameId)
      videoGamesList.splice(index, 1)
      resolve();
    }, 1000)
  })
}

/**
 *
 * @param videoGameName
 * @returns {Promise<VideoGame|undefined>}
 */
export async function getVideoGameByName(videoGameName) {
  const id = await computeVideoGameId(videoGameName)
  return await getVideoGameById(id)
}


/**
 *
 * @returns {Promise<VideoGame|undefined>}
 * @param {string} videoGameId
 */
export function getVideoGameById(videoGameId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(videoGamesList.find(game => game.id === videoGameId))
    }, 500)
  })
}

