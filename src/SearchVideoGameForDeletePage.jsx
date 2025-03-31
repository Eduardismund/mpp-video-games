import VideoGameLookup from "./VideoGameLookup.jsx";
import {useNavigate} from "react-router-dom";

export function SearchVideoGameForDeletePage(){

  const navigate = useNavigate()

  const handleGameCheck = (game) => {

    if(game){
      navigate(`/delete-video-game/${game.id}`)
    }
  };

  return (
    <>
      <VideoGameLookup mode="delete" onGameFound={handleGameCheck}/>
    </>
  )
}
