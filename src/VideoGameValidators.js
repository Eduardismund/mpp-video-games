/**
 * @typedef {Object} FieldValidationResult
 * @property {boolean} success
 * @property {string[]} [errors] missing if success == true
 */

/**
 * @callback fieldValidator
 * @param {any} fieldValue
 * @return {Promise<FieldValidationResult>}
 */

import {computeVideoGameId, getVideoGameByName} from "./VideoGameStore.js";
import {getGenreList} from "./GenreStore.js";

/**
 *
 * @param {string} fieldName
 * @return {fieldValidator}
 */
export function getFieldValidator(fieldName) {
  return validatorsByField[fieldName]
    || (() => Promise.resolve({success: true}))
}

export function getCheckFieldValidator(fieldName) {
  return checkValidatorByName[fieldName]
}

/**
 *
 * @param formData
 * @return {Promise<{[string]: FieldValidationResult}>}
 */
export function getObjectValidator(formData) {
  return Promise.all(
    Object.keys(formData).map(key => ({key, validator: getFieldValidator(key)}))
      .map(({key, validator}) => ({key, resultPromise: validator(formData[key])}))
      .map(({key, resultPromise}) => resultPromise.then(result => ({key, result})))
  ).then(keyAndResults => keyAndResults.reduce((prev, curr) => ({...prev, [curr.key]: curr.result}), {}))

}

/**
 * @param {any} fieldValue
 * @return {Promise<FieldValidationResult>}
 */
function required(fieldValue) {
  if (!fieldValue) {
    return Promise.resolve({
      success: false,
      errors: [
        'This field is required'
      ]
    })
  }
  return Promise.resolve({
    success: true
  })
}

/**
 *
 * @param {string} videoGameName
 * @returns {Promise<FieldValidationResult>}
 */
async function videoGameAlreadyExists(videoGameName) {
  const videoGame = await getVideoGameByName(videoGameName)
  if (videoGame) {
    return {
      success: false,
      errors: ['The game already exists']
    }
  }
  return {
    success: true
  }
}

/**
 *
 * @param {string} releaseDate
 * @returns {Promise<FieldValidationResult>}
 */
async function isValidReleaseDate(releaseDate) {
  const regex = /^[0-9]{4}(-[0-9]{2}){2}$/g
  if (!releaseDate.length) {
    return {
      success: true
    }
  }
  if (!regex.test(releaseDate)) {
    return {
      success: false,
      errors: ['The release date does not follow the given format']
    }
  }
  const gameReleaseDate = new Date(releaseDate)

  if (isNaN(gameReleaseDate.getTime())) {
    return {
      success: false,
      errors: ['The release date is not a valid date']
    }
  }

  if (gameReleaseDate > new Date()) {
    return {
      success: false,
      errors: ['The release date is set in the future']
    }
  }
  return {
    success: true
  }
}


async function existingGenre(genre) {
  if (!genre) {
    return {
      success: true
    }
  }
  if (!(await getGenreList()).find(genreName => genreName === genre)) {
    return {
      success: false,
      errors: [`The genre ${genre} is not a valid option`]
    };
  }

  return {
    success: true
  };
}

/**
 *
 * @param {string} price
 * @returns {Promise<FieldValidationResult>}
 */
async function isNumber(price) {
  const regex = /^[1-9][0-9]*(\.[0-9]{1,2})?$/;
  if (!regex.test(price) && price.length) {
    return {
      success: false,
      errors: ['The price is not valid']
    }
  }
  return {
    success: true
  }
}


/**
 * @param {string} fieldValue
 * @param {number} minLen
 * @return {Promise<FieldValidationResult>}
 */
function minLength(fieldValue, minLen) {
  if (typeof (fieldValue) === 'string' && fieldValue && fieldValue.length < minLen) {
    return Promise.resolve({
      success: false,
      errors: [
        `This field should have a minimum length of ${minLen}`
      ]
    })
  }
  return Promise.resolve({
    success: true
  })
}

/**
 *
 * @param {Promise<FieldValidationResult>[]} resultPromises
 * @return {Promise<FieldValidationResult>}
 */
function reduceFieldValidationResults(resultPromises) {
  return Promise.all(resultPromises)
    .then(results =>
      results.reduce((previousValue, currentValue) => {
        if (currentValue.success) {
          return previousValue
        }
        if (previousValue.success) {
          return currentValue
        }
        return {success: false, errors: [...previousValue.errors, ...currentValue.errors]}
      }))
}

const validatorsByField = {
  name: (name, mode) => {
    if (mode === 'update') {
      return Promise.resolve({success: true})
    }

    return reduceFieldValidationResults([
      required(name),
      minLength(name, 2),
      videoGameAlreadyExists(name)
    ])
  },
  genre: (genre) => {
    return reduceFieldValidationResults([
      required(genre),
      existingGenre(genre),
      minLength(genre, 2)
    ])
  },
  releaseDate: (releaseDate) => {
    return reduceFieldValidationResults([
      required(releaseDate),
      isValidReleaseDate(releaseDate)
    ])

  },
  price: (price) => {
    return reduceFieldValidationResults([
      required(price),
      isNumber(price)
    ])
  }
}

const checkValidatorByName = {
  name: (name) => {
    return reduceFieldValidationResults([
      required(name)])
  }
}
