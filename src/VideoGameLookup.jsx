import {useState} from "react";
import {getVideoGameByName} from "./RemoteVideoGameStore.js";
import {useToast} from "./ToastContext.jsx";
import {getDictionary} from "./dictionary.js";

/**
 *
 * @param {'update' | 'delete'} mode
 * @param onGameFound
 * @returns {JSX.Element}
 * @constructor
 */
function VideoGameLookup({mode, onGameFound}) {
  const dict = getDictionary('en')
  const [gameName, setGameName] = useState("")
  const {showToast} = useToast()

  const handleChange = (e) => {
    setGameName(e.target.value);
  }

  const handleCheckGame = async (e) => {
    e.preventDefault();
    if (!gameName.trim()) {
      showToast(dict.videoGameLookup.messages.nameRequired, "info")
      return;
    }
    try {
      const game = await getVideoGameByName(gameName);
      if (game) {
        onGameFound(game);
        return
      }
      showToast(dict.videoGameLookup.messages.noResult, "info")
    } catch (ex) {
      showToast(dict.videoGameLookup.messages.unexpectedError, "error")
      console.error(ex)
    }

  }

  return (
    <form className="form-container" onSubmit={handleCheckGame}>
      <div className="form-group">
        <label>{dict.videoGameLookup.labelFor[mode]}</label>
        <input
          type="text"
          name="gameName"
          value={gameName}
          onChange={handleChange}
          placeholder={dict.videoGameLookup.searchInput.placeholder}
        />
      </div>

      <button type="submit">{dict.videoGameLookup.searchButton.label}</button>


    </form>

  );
}

export default VideoGameLookup;

