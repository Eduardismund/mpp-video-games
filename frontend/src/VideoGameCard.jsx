import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
import { fileStore } from "./FileStore.js";

const VideoGameCard = ({ game, priceClass }) => {
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/video-games/${game.id}/reviews`, {
          headers: { Authorization: sessionStorage.getItem("token") },
        });
        if (res.ok) {
          const { items } = await res.json();
          setItems(items);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, [game.id]);

  return (
    <div className={`card ${priceClass}`}>
      <img
        src={fileStore.getPathToFile(game.image ?? "coming-soon.jpeg")}
        alt={game.name}
      />
      <div className="card-content">
        <h2>{game.name}</h2>
        <p>Genre: {game.genre}</p>
        <p>Release Date: {game.releaseDate}</p>
        <p className="price">{game.price}</p>
        <p>Owner: {game.username}</p>

        {items.length > 0 && (
          <div>
            <h3 onClick={() => setShowItems(!showItems)}>
              {showItems ? "Hide Reviews" : "Show Reviews"}

            </h3>
            {showItems && (
            <ul >
              {items.map((review, index) => (
                <li key={index}>
                  <p><strong>Text:</strong> {review.text}</p>
                  <p><strong>Score:</strong> {review.score}</p>
                  <p><strong>Timestamp:</strong> {new Date(review.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>)}
          </div>
        )}
      </div>
      <Link to={`/update-video-game/${game.id}`}>
        <Edit size={18} />
      </Link>
      <Link to={`/delete-video-game/${game.id}`}>
        <Trash size={18} />
      </Link>
    </div>
  );
};

export default VideoGameCard;
