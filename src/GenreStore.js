/**
 *  @return {Promise<string[]>}
 */
export function getGenreList(){
  return new Promise( resolve => {
    setTimeout(() => {
      resolve(['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Fantasy', 'Thriller', 'Romance', 'Adventure'])

    }, 1000)
  })
}
