import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getDictionary} from "./dictionary.js";
import {getFieldValidator, initVideoGameValidators, validateVideoGame} from "./VideoGameValidators.js";
import {useToast} from "./ToastContext.jsx";
import {videoGameStore} from "./WrapperVideoGameStore.js";
import {fileStore} from "./FileStore.js";
import UploadForm from "./UploadForm.jsx";

/**
 *
 * @param {string} [id]
 * @param {'create' | 'update', 'delete'} mode
 * @returns {JSX.Element}
 * @constructor
 */
function VideoGameForm({id, mode}) {
  initVideoGameValidators({
    getVideoGameByName: async (name) => videoGameStore.getVideoGameByName(name),
    getGenreList: async () => await videoGameStore.getGenreList()
  })
  let initialState = {name: "", genre: "", releaseDate: "", price: ""};
  const [formData, setFormData] = useState(initialState)
  const [genreOptions, setGenreOptions] = useState([])
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const dictionary = getDictionary("en").videoGameFields
  const {showToast, showConfirmation} = useToast();
  const [gameImage, setGameImage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setGenreOptions(await videoGameStore.getGenreList())
      if (mode === 'update' || mode === 'delete') {
        const videoGame = await videoGameStore.getVideoGameById(id)
        if (!videoGame) {
          showToast("Video game not found!", "error")
          return
        }
        /**
         * @type {any}
         */
        const newFormData = {...videoGame, price: `${videoGame.price}`}
        delete newFormData.id
        setFormData(newFormData)
        mode === 'update' ? setGameImage(fileStore.getPathToFile(videoGame.image ?? 'coming-soon.jpeg')) : setGameImage(fileStore.getPathToFile('coming-soon.jpeg'))
      }
    }
    // noinspection JSIgnoredPromiseFromCall
    fetchData()
  }, [id, mode])

  const handleChange = async (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value});
    const vldRes = await getFieldValidator(name)(value, mode)
    if (vldRes.success) {
      delete errors[name]
      setErrors({...errors})
    } else {
      setErrors({...errors, [name]: vldRes.errors})
    }

  }
  const handleImageChange = async (image) => {
    await videoGameStore.updateVideoGame({id, image});
    setGameImage(fileStore.getPathToFile(image))

  }

  /**
   * @param {object} formDataObj
   * @return {Partial<VideoGame>}
   */
  function mapFormDataToVideoGame(formDataObj) {
    const videoGame = {
      name: `${formDataObj?.name}`.trim(),
      genre: `${formDataObj?.genre}`.trim(),
      releaseDate: `${formDataObj?.releaseDate}`,
      price: Number(formDataObj.price)
    }

    if (mode === "update") {
      videoGame.id = id
    }

    return videoGame
  }

  async function performFieldValidations() {

    try {
      const newErrors = await validateVideoGame(formData, mode)
      setErrors(newErrors)
      return Object.keys(newErrors).length < 1
    } catch (ex) {
      console.error(ex)
    }

  }

  function handleError(err) {
    if (err.message === 'LOGIN_REQUIRED'){
      showToast("Login required!", "error")
      return
    }
    if (err.message === 'FORBIDDEN'){
      showToast("This action is forbidden!", "error")
      return
    }
    showToast("Unexpected error!", "error")
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'delete' || await performFieldValidations()) {
      if (mode === "delete") {
        showConfirmation({
          message: 'Are you sure you want to delete this video game?',
          confirmLabel: 'Yes, Delete',
          onConfirm: async () => {
            try{
              await videoGameStore.deleteVideoGame(`${id}`)
              showToast("Video Game Deleted Successfully!", "success")
              navigate(`/list-video-games`)
            } catch (e){
              handleError(e)

            }

          }
        })
      } else if (mode === "update") {
        try{
          await videoGameStore.updateVideoGame(mapFormDataToVideoGame(formData));
          showToast("Video Game Updated Successfully!", "success")
        } catch (e){
          handleError(e)
        }
      } else {
        try{
          const id = await videoGameStore.addVideoGame(mapFormDataToVideoGame(formData))
          showToast("Video Game Added Successfully!", "success")
          navigate(`/update-video-game/${id}`)
        } catch (e){
          handleError(e)
        }

      }
    }
  }

  function submitButtonLabel() {
    switch (mode) {
      case "create":
        return "Create Video Game"
      case "update":
        return "Update Video Game"
      case "delete":
        return "Delete Video Game"
    }
    return "Submit"
  }

  return (
    <>
      <div className={`video-game-form-container ${mode}`}>

        <form onSubmit={handleSubmit} className="form-container">

          <div className="form-group name">
            <label>{mode === 'delete' ? dictionary.name.shortName : dictionary.name.inputName}</label>
            <input name="name"
                   value={formData.name}
                   onChange={handleChange}
                   placeholder={dictionary.name.shortName}
                   readOnly={mode === "update"}
                   disabled={mode === 'delete'}
            />
            {errors.name && <span className="error">{errors.name}</span>}

          </div>
          <div className="form-group genre">
            <label>{mode === 'delete' ? dictionary.genre.shortName : dictionary.genre.inputName}</label>
            <select name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder={dictionary.genre.shortName}
                    disabled={mode === 'delete'}>
              <option></option>
              {genreOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.genre && <span className="error">{errors.genre}</span>}

          </div>
          <div className="form-group releaseDate">
            <label>{mode === 'delete' ? dictionary.releaseDate.shortName : dictionary.releaseDate.inputName}</label>
            <input name="releaseDate"
                   value={formData.releaseDate}
                   onChange={handleChange}
                   placeholder={dictionary.releaseDate.shortName}
                   disabled={mode === 'delete'}/>
            {errors.releaseDate && <span className="error">{errors.releaseDate}</span>}

          </div>
          <div className="form-group price">
            <label>{mode === 'delete' ? dictionary.price.shortName : dictionary.price.inputName}</label>
            <input name="price"
                   value={formData.price}
                   onChange={handleChange}
                   placeholder={dictionary.price.shortName}
                   disabled={mode === 'delete'}/>
            {errors.price && <span className="error">{errors.price}</span>}

          </div>
          <button type="submit" disabled={Object.keys(errors).length > 0}>{submitButtonLabel()}</button>
        </form>
        {mode === "create" ? "" :
          <div className="image-container">
            <img src={gameImage} alt={"Video Game Poster"}/>
            {mode === "delete" ? "" : <UploadForm onChange={handleImageChange}/>}
          </div>
        }
      </div>

    </>

  )
}

export default VideoGameForm
