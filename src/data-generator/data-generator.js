import {faker} from "@faker-js/faker";
import {getGenreList} from "../GenreStore.js";
import {writeFile} from "node:fs";

/**
 *
 * @param {Object} params
 * @param {number} params.count
 * @return Promise<VideoGame[]>
 */
async function generateData(params) {
  const genres = await getGenreList()
  const generatedData =  Array.from({length: params.count}, () =>
    generateSingularVideoGame({genres})
  );

  const jsonData = JSON.stringify(generatedData, null, 2);

  writeFile('data.json', jsonData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data successfully written to data.json');
    }
  });
}

/**
 *
 * @param genres
 * @returns {VideoGame}
 */
function generateSingularVideoGame({ genres }) {
  const uniqueNames = new Set();
  let name;

  do {
    name = faker.commerce.productName();
  } while (uniqueNames.has(name));

  uniqueNames.add(name);

  return {
    name: name,
    genre: faker.helpers.arrayElement(genres),
    releaseDate: faker.date.past(20).toISOString().substring(0, 10),
    price: faker.datatype.number({ min: 0, max: 100, precision: 0.01 }),
  };
}

const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0], 10) : 10;

const params = { count };

generateData(params).then(() => {
  console.log('Data generation complete!');
}).catch(err => {
  console.error('Error generating data:', err);
});
