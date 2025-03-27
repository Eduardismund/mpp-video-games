import React, { useState, useEffect } from "react";
import { getDictionary } from "./dictionary.js";
import {getVideoGamesList} from "./VideoGameStore.js";
import {Edit, Trash} from "lucide-react";
import {Link} from "react-router-dom";


function ListVideoGamesPage() {
  const [videoGameList, setVideoGameList] = useState([]);
  const [maxPrice, setMaxPrice] = useState(70); // Default max price

  useEffect(() => {
    async function fetchData () {
      const list = await getVideoGamesList()
      setVideoGameList(list);
      console.log(list)
    }
    fetchData()
  }, []);


  const dictionary = getDictionary("en").videoGameFields;

  const filteredGames = videoGameList.filter(game => game.price <= maxPrice);

  return(
    <div className="table-container">
      <table>
        <thead>
        <tr>
          <th>Image</th>

          <th>{dictionary.name.shortName}</th>
          <th>{dictionary.genre.shortName}</th>
          <th>{dictionary.releaseDate.shortName}</th>
          <th>{dictionary.price.shortName}</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {filteredGames.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No games found.</td>
          </tr>
        ) : (
          filteredGames.map((game, index) => (
            <tr key={index}>
              <td>
                <img src="/images/coming-soon.jpeg" alt={game.name} className="game-image" />
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
          Max Price: <strong>${maxPrice}</strong>
        </label>
        <input
          type="range"
          id="priceRange"
          min="10"
          max="70"
          step="5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>
    </div>
  );

}

export default ListVideoGamesPage;
