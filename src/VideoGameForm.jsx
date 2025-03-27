import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getDictionary} from "./dictionary.js";
import {getFieldValidator} from "./VideoGameValidators.js";
import {addVideoGame, getVideoGameById, updateVideoGame} from "./VideoGameStore.js";
import {getGenreList} from "./GenreStore.js";
import {useToast} from "./ToastContext.jsx";

/**
 *
 * @param {string} [id]
 * @param {'create' | 'update'} mode
 * @returns {JSX.Element}
 * @constructor
 */
function VideoGameForm({id, mode}) {
  let initialState = {name: "", genre: "", releaseDate: "", price: ""};
  const [formData, setFormData] = useState(initialState)
  const [genreOptions, setGenreOptions] = useState([])
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const dictionary = getDictionary("en").videoGameFields
  const { showToast } = useToast();



  useEffect(() => {
    const fetchData = async () => {
      setGenreOptions(await  getGenreList())
      if (mode === 'update') {
        const videoGame = await getVideoGameById(id)
        if(!videoGame){
          showToast("Video game not found!", "error")
          return
        }
        /**
         * @type {any}
         */
        const newFormData = {...videoGame, price: `${videoGame.price}`}
        delete newFormData.id
        setFormData(newFormData)
      }
    }
    fetchData();
  }, [])

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

  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const results = await Promise.all(Object.keys(formData).map(key => getFieldValidator(key)(formData[key], mode)))
    const newErrors = Object.keys(formData).map((key, index) => ({key, result: results[index]}))
      .filter(({result}) => !result.success)
      .reduce((previous, current) => ({...previous, [current.key]: current.result.errors}), {})
    setErrors(newErrors)
    if (Object.keys(newErrors).length < 1) {
      try {
        if (mode === "create") {
          const id = await addVideoGame(mapFormDataToVideoGame(formData))
          showToast("Video Game Added Successfully!", "success")
          navigate(`/update-video-game/${id}`)
        } else {
          await updateVideoGame(mapFormDataToVideoGame(formData));
          showToast("Video Game Updated Successfully!", "success")
        }

      } catch (ex) {
        showToast("An unexpected error occurred!", "error")
        console.error(ex)
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>{dictionary.name.inputName}</label>
          <input name="name"
                 value={formData.name}
                 onChange={handleChange}
                 placeholder={dictionary.name.shortName}
                 readOnly={mode === "update"}
          />
          {errors.name && <span style={{color: "red"}}>{errors.name}</span>}

        </div>
        <div className="form-group">
          <label>{dictionary.genre.inputName}</label>
          <select name="genre"
                 value={formData.genre}
                 onChange={handleChange}
                  placeholder={dictionary.genre.shortName}>
            <option></option>
            {genreOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.genre && <span style={{color: "red"}}>{errors.genre}</span>}

        </div>
        <div className="form-group">
          <label>{dictionary.releaseDate.inputName}</label>
          <input name="releaseDate"
                 value={formData.releaseDate}
                 onChange={handleChange}
                 placeholder={dictionary.releaseDate.shortName}/>
          {errors.releaseDate && <span style={{color: "red"}}>{errors.releaseDate}</span>}

        </div>
        <div className="form-group">
          <label>{dictionary.price.inputName}</label>
          <input name="price"
                 value={formData.price}
                 onChange={handleChange}
                 placeholder={dictionary.price.shortName}/>
          {errors.price && <span style={{color: "red"}}>{errors.price}</span>}

        </div>
        <button type="submit" disabled={Object.keys(errors).length > 0}>Submit</button>
      </form>
    </>

  )
}

export default VideoGameForm
