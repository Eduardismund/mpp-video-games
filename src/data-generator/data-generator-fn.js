import {faker} from "@faker-js/faker";

/**
 *
 * @param genres
 * @param uniqueNames
 * @returns {VideoGame}
 */
export function generateSingularVideoGame({genres, uniqueNames}) {
  let name;

  do {
    name = faker.commerce.productName();
  } while (uniqueNames.has(name));

  uniqueNames.add(name);

  return {
    name: name,
    genre: faker.helpers.arrayElement(genres),
    releaseDate: faker.date.past(20).toISOString().substring(0, 10),
    price: faker.datatype.number({min: 0, max: 100, precision: 0.01}),
  };
}

