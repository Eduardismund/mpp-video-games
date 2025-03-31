import React, {useState, useEffect} from "react";
import {getDictionary} from "./dictionary.js";
import {getVideoGamesList, getVideoGameStatistics} from './VideoGameStore.js'
import {Edit, Trash} from "lucide-react";
import {Link} from "react-router-dom";


function ListVideoGamesPage() {
  const [videoGameList, setVideoGameList] = useState([]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(0);
  const [absoluteMinPrice, setAbsoluteMinPrice] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const {minPrice, maxPrice} = await getVideoGameStatistics(['minPrice', 'maxPrice'])
      setAbsoluteMaxPrice(maxPrice)
      setAbsoluteMinPrice(minPrice)
      setSelectedMaxPrice(maxPrice)
      setVideoGameList(await getVideoGamesList({minPrice, maxPrice}));
      setLoaded(true)
    }

    fetchData()
  }, []);


  const dict = getDictionary("en").videoGamesList;

  async function onPrinceRangeChange(evt) {
    const maxPrice = Number(evt.target.value)
    setSelectedMaxPrice(maxPrice)
    setVideoGameList(await getVideoGamesList({maxPrice}));
  }


  return (
    !loaded
      ? <p>Loading...</p>
      : <div className="table-container">
        <table>
          <thead>
          <tr>
            <th>Image</th>

            <th>{dict.headers.name}</th>
            <th>{dict.headers.genre}</th>
            <th>{dict.headers.releaseDate}</th>
            <th>{dict.headers.price}</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {videoGameList.length === 0 ? (
            <tr>
              <td colSpan="5" style={{textAlign: "center", padding: "20px"}}>{dict.messages.noResult}</td>
            </tr>
          ) : (
            videoGameList.map((game, index) => (
              <tr key={index}>
                <td>
                  <img src="/images/coming-soon.jpeg" alt={game.name} className="game-image"/>
                </td>
                <td>{game.name}</td>
                <td>{game.genre}</td>
                <td>{game.releaseDate}</td>
                <td>${game.price.toFixed(2)}</td>
                <td>
                  <Link to={`/update-video-game/${game.id}`}><Edit size={18}/></Link>
                  <Link to={`/delete-video-game/${game.id}`}><Trash size={18}/></Link>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>

        <div className="filter-container">
          <label htmlFor="priceRange">
            <span>{dict.filters.maxPrice}</span>: <strong>${selectedMaxPrice}</strong>
          </label>
          <input
            type="range"
            id="priceRange"
            min={absoluteMinPrice}
            max={absoluteMaxPrice}
            step="1"
            value={selectedMaxPrice}
            onChange={onPrinceRangeChange}
          />
        </div>
      </div>
  );

}

export default ListVideoGamesPage;
