import VideoGameLookup from "./VideoGameLookup.jsx";
import {useNavigate} from "react-router-dom";

export function SearchVideoGameForUpdatePage(){

  const navigate = useNavigate()

  const handleGameCheck = (game) => {
    if(game){
      navigate(`/update-video-game/${game.id}`)
    }
  };

  return (
    <>
      <VideoGameLookup onGameFound={handleGameCheck}/>
    </>
  )
}
