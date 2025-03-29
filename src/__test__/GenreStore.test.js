import {expect, test} from 'vitest';
import expectedGenreList from "../genre.json"
import {getGenreList} from "../GenreStore.js";

test("get genre list", async () => {
  const actualGenres = await getGenreList()
  expect(actualGenres).toBe(expectedGenreList)
})

