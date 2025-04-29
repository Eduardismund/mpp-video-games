import React from "react";
import {Link} from "react-router-dom";
import {Edit, Trash} from "lucide-react";
import {fileStore} from "./FileStore.js";

const VideoGameCard = ({ game, priceClass}) => {
  return (
    <div className={`card ${priceClass}`}>
      <img src={fileStore.getPathToFile(game.image ?? 'coming-soon.jpeg')} alt={game.name} />
      <div className="card-content">
        <h2>{game.name}</h2>
        <p>Genre: {game.genre}</p>
        <p>Release Date: {game.releaseDate}</p>
        <p className="price">{game.price}</p>
      </div>
      <Link to={`/update-video-game/${game.id}`}><Edit size={18}/></Link>
      <Link to={`/delete-video-game/${game.id}`}><Trash size={18}/></Link>
    </div>
  );
};

export default VideoGameCard;
