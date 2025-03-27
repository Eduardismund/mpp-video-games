import {useState} from "react";
import {checkVideoGameExistence, getVideoGameByName} from "./VideoGameStore.js";
import {useToast} from "./ToastContext.jsx";

function VideoGameLookup({onGameFound}) {
  const [gameName, setGameName] = useState("");
  const {showToast} = useToast();


  const handleChange = (e) => {
    setGameName(e.target.value);
  }

  const handleCheckGame = async (e) => {
    e.preventDefault();
    if (!gameName.trim()) {
      showToast("Please enter a valid name!", "info")
      return;
    }

    try {
      const game = await getVideoGameByName(gameName);
      if (!!game) {
        onGameFound(game);
        return
      }
      showToast("No game with that name found!", "info")


    } catch (ex) {
      showToast("Error while checking game existence!", "error")

      console.error(ex)
    }

  }

  return (
    <form className="form-container" onSubmit={handleCheckGame}>
      <div className="form-group">
        <label>Look up the game you want</label>
        <input
          type="text"
          name="gameName"
          value={gameName}
          onChange={handleChange}
          placeholder="Enter Video Game Name"
        />
      </div>

      <button type="submit">Search</button>


    </form>

  );
}

export default VideoGameLookup;

