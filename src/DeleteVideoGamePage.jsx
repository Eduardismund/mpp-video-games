import VideoGameLookup from "./VideoGameLookup.jsx";
import {useEffect, useState} from "react";
import {deleteVideoGame, getVideoGameById, getVideoGameByName} from "./VideoGameStore.js";
import {useNavigate, useParams} from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog.jsx"; // Assuming getVideoGameByName is implemented

function DeleteVideoGamePage() {
  const [gameExists, setGameExists] = useState(null);
  const [videoGame, setVideoGame] = useState(null);
  const [message, setMessage] = useState(""); // State for messages
  const {id} = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    const fetchData = async () => {
      const videoGame = await getVideoGameById(id)
      setGameExists(!!videoGame)
      /**
       * @type {any}
       */
      const newFormData = {...videoGame, price: `${videoGame.price}`}
      delete newFormData.id
      setVideoGame(newFormData)

    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameExists) {
      setMessage("Game does not exist. Cannot delete.");
      return;
    }
    setMessage(`Are you sure you want to delete "${videoGame.name}"`)
  };
  const confirmDelete = async () =>{
      try {
        await deleteVideoGame(videoGame.name); // Call delete function
        setMessage("Game Deleted Succesfully")
        setTimeout(() => navigate("/home"), 1000);
        setVideoGame(null); // Clear video game after deletion
      } catch {
        setMessage("error")
      }
    }


return (
  <div>
    {message && <p style={{ color: gameExists ? "black" : "red" }}>{message}</p>}

    {videoGame ? (
      <div>
        <div className="game-details">
          <p><strong>Name:</strong> {videoGame.name}</p>
          <p><strong>Genre:</strong> {videoGame.genre}</p>
          <p><strong>Release Date:</strong> {new Date(videoGame.releaseDate).toLocaleDateString()}</p>
          <p><strong>Price:</strong> {videoGame.price}</p>
        </div>
        <button onClick={handleSubmit} disabled={!gameExists || !videoGame}>
          Delete Game
        </button>
        {message.includes("Are you sure") && (
          <ConfirmationDialog onConfirm={confirmDelete} onCancel={() => setMessage('')} confirmLabel="Yes, Delete"/>
        )}

      </div>
    ) : (
      <p>Loading game details...</p>
    )}
  </div>
);

}

export default DeleteVideoGamePage;
