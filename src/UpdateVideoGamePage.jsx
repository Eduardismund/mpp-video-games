import {useParams} from "react-router-dom";
import VideoGameForm from "./VideoGameForm.jsx";


function UpdateVideoGamePage() {
  const {id} = useParams()

  return (<>
      <VideoGameForm id={id} mode="update"/>
    </>
  );
}

export default UpdateVideoGamePage
