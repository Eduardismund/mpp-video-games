import genreList from "./genre.json"
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
