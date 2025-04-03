import genreList from "./genre.json" with { type: "json" };
/**
 *  @return {Promise<string[]>}
 */
export function getGenreList(){
  return new Promise( resolve => {
    setTimeout(() => {
      resolve(genreList)

    }, 1000)
  })
}
