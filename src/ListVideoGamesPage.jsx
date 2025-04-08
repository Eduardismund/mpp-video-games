import React, {useEffect, useRef, useState} from "react";
import {getDictionary} from "./dictionary.js";
import {videoGameStore} from "./WrapperVideoGameStore.js";
import VideoGameCard from "./VideoGameCard.jsx";


function ListVideoGamesPage() {
  const [videoGameList, setVideoGameList] = useState([])
  const [pricePercentiles, setPricePercentiles] = useState({})
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(-1)
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(0)
  const [absoluteMinPrice, setAbsoluteMinPrice] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const totalCountRef = useRef(totalCount)
  const [loaded, setLoaded] = useState(false)
  const pageSize = 3
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(offset)


  async function onPriceRangeChange(evt) {
    const maxPrice = Number(evt.target.value)
    setSelectedMaxPrice(maxPrice)
  }

  useEffect(() => {
    let filterMaxPrice = selectedMaxPrice
    let filterMinPrice = absoluteMinPrice

    async function fetchData() {
      if (selectedMaxPrice === -1) {
        const {priceMetrics} = await videoGameStore.getVideoGameStatistics({
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
      const {items, totalCount} = await videoGameStore.getVideoGamesList({
        minPrice: filterMinPrice,
        maxPrice: filterMaxPrice,
        offset: offset,
        maxItems: pageSize
      })
      setVideoGameList([...videoGameList, ...items])
      console.log(items, videoGameList)
      setTotalCount(totalCount)
      setLoaded(true)
    }

    fetchData()
  }, [pageSize, offset, selectedMaxPrice]);


  const dict = getDictionary("en").videoGamesList;

  function getVideoGameRowClass(game) {
    if (game.price <= pricePercentiles.p10) {
      return "p10"
    }
    if (game.price >= pricePercentiles.p90) {
      return "p90"
    }
    if (game.price >= pricePercentiles.p40 && game.price <= pricePercentiles.p60) {
      return "median"
    }
    return ""
  }

  useEffect(() => {
    totalCountRef.current = totalCount;
  }, [totalCount]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const handleScroll = () => {
      const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
      console.log(scrollTop, scrollHeight, clientHeight)
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log(offsetRef.current, totalCountRef.current)
        if (offsetRef.current < totalCountRef.current) {
          setOffset(prev => prev + pageSize)
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      {!loaded
        ? <p>Loading...</p>
        : (
          <>
            <div className="card-grid">
              {videoGameList.length === 0 ? (
                <div className="no-results">{dict.messages.noResult}</div>
              ) : (
                videoGameList.map((game, index) => (
                  <VideoGameCard key={index} game={game} priceClass={getVideoGameRowClass(game)}/>))
              )}
            </div>
            <div className="filter-container">
              <label htmlFor="priceRange">
                <span>{dict.filters.maxPrice}</span>: <strong>${selectedMaxPrice}</strong>
              </label>
              <input type="range" id="priceRange" min={absoluteMinPrice} max={absoluteMaxPrice}
                     step="1" value={selectedMaxPrice} onChange={onPriceRangeChange}
              />
            </div>
          </>
        )
      }
    </>


  );

}

export default ListVideoGamesPage;

