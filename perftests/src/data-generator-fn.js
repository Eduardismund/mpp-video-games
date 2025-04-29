import {faker} from "@faker-js/faker";

/**
 *
 * @param {string[]}genres
 * @returns {Partial<VideoGame>}
 */
export function generateSingularVideoGame({genres}) {
  return {
    name: faker.commerce.productName()+' ' + faker.commerce.productName(),
    genre: faker.helpers.arrayElement(genres),
    releaseDate: faker.date.past(20).toISOString().substring(0, 10),
    price: faker.datatype.number({min: 0, max: 100, precision: 0.01}),
  };

}

/**
 *
 * @returns {Partial<VideoGameReview>}
 */
export function generateSingularVideoGameReview() {
  return {
    text: faker.lorem.sentence().slice(0, 50).trimEnd(),
    score: faker.datatype.number({min: 0, max: 10, precision: 1})
  };
}

