import {readFile, writeFile} from "node:fs/promises";
import genreListJson from "../genre.json" with {type: "json"};
import {generateSingularVideoGame} from "./data-generator-fn.js";

/**
 *
 * @param {Object} params
 * @param {number} params.count
 * @param {string} params.filename
 * @return Promise<VideoGame[]>
 */
async function generateData(params) {
  const genres = genreListJson
  const fileData = await loadFileContent(params.filename)
  const uniqueNames = new Set(fileData.map(videoGame => videoGame.name))
  const generatedData = Array.from({length: params.count}, () =>
    generateSingularVideoGame({genres, uniqueNames})
  );

  const jsonData = JSON.stringify([...fileData, ...generatedData], null, 2);

  await writeFile(params.filename, jsonData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`Data successfully written to ${params.filename}`);
    }
  });
}

async function loadFileContent(path){
  try {
    return JSON.parse(await readFile(path, "utf-8"));
  } catch (error) {
    console.error("Error reading file:", error);
    return []
  }
}

const args = process.argv.slice(2);
const filename = args[1]
const count = args[0] ? parseInt(args[0], 10) : 10;

const params = {count, filename};

try {
  console.log('Data generation complete!');

  await generateData(params)
}catch (e){
  console.error(e.message)
}
