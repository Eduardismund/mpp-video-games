import React, {useEffect, useState} from "react";
import {getDictionary} from "./dictionary.js";
import {getVideoGameStatistics, getVideoGamesList} from './RemoteVideoGameStore.js'
import {Edit, Trash} from "lucide-react";
import {Link, useParams, useNavigate} from "react-router-dom";
import Pagination from "./Pagination.jsx";


function ListVideoGamesPage() {
  const [videoGameList, setVideoGameList] = useState([]);
  const [pricePercentiles, setPricePercentiles] = useState({});
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(-1);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(0);
  const [absoluteMinPrice, setAbsoluteMinPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const {page} = useParams()
  const navigate = useNavigate()
  const pageNumber = Number(page || 1)
  const pageSize = 3
  const offset = (pageNumber-1) * pageSize

  async function onPriceRangeChange(evt) {
    const maxPrice = Number(evt.target.value)
    setSelectedMaxPrice(maxPrice)
  }
  useEffect(() => {
    let filterMaxPrice = selectedMaxPrice
    let filterMinPrice = absoluteMinPrice
    async function fetchData() {
      if (selectedMaxPrice === -1) {
        const {priceMetrics} = await getVideoGameStatistics({
          priceMetrics: {min: true, max: true, percentiles: [10, 40, 60, 90]}
        })
        setAbsoluteMaxPrice(filterMaxPrice = Math.ceil(priceMetrics.max))
        setAbsoluteMinPrice(filterMinPrice = Math.floor(priceMetrics.min))
        setSelectedMaxPrice(filterMaxPrice)
        setPricePercentiles({
          p10: priceMetrics.percentiles.find(percentile => percentile.p === 10)?.v || 0,
          p40: priceMetrics.percentiles.find(percentile => percentile.p === 40)?.v || 0,
          p60: priceMetrics.percentiles.find(percentile => percentile.p === 60)?.v || 0,
          p90: priceMetrics.percentiles.find(percentile => percentile.p === 90)?.v || 0,
        })
      }
      const {items, totalCount} = await getVideoGamesList({
        minPrice: filterMinPrice,
        maxPrice: filterMaxPrice,
        offset: offset,
        maxItems: pageSize
      })
      setVideoGameList(items)
      setTotalCount(totalCount)
      const pageCount = Math.ceil(totalCount / pageSize)
      if ( pageNumber > pageCount) {
        navigate('/list-video-games')
      }
      setLoaded(true)
    }

    fetchData()
  }, [pageSize, offset, selectedMaxPrice]);


  const dict = getDictionary("en").videoGamesList;

  function getVideoGameRowClass(game){
    if(game.price <= pricePercentiles.p10){
      return "p10"
    }
    if(game.price >= pricePercentiles.p90){
      return "p90"
    }
    if(game.price >= pricePercentiles.p40 && game.price <= pricePercentiles.p60){
      return "median"
    }
    return ""

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
              <tr className={getVideoGameRowClass(game)} key={index}>
                <td>
                  <img src="/images/coming-soon.jpeg" alt={game.name} className="game-image"/>
                </td>
                <td>{game.name}</td>
                <td>{game.genre}</td>
                <td>{game.releaseDate}</td>
                <td>${game.price?.toFixed(2)}</td>
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
            onChange={onPriceRangeChange}
          />
        </div>
      <Pagination baseUri="/list-video-games" currentPage={pageNumber} maxPageButtonsCount={10} pageSize={pageSize} totalCount={totalCount}/>


      </div>
  );

}

export default ListVideoGamesPage;
