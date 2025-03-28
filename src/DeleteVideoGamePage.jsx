import {useParams} from "react-router-dom";
import VideoGameForm from "./VideoGameForm.jsx"; // Assuming getVideoGameByName is implemented

function DeleteVideoGamePage() {
  const {id} = useParams()
return (
  <>
    <VideoGameForm mode="delete" id={id} />
  </>
);

}

export default DeleteVideoGamePage;
