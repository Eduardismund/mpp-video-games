import {beforeEach, describe, expect, test, vi} from "vitest";
import {getFieldValidator, initVideoGameValidators} from "../VideoGameValidators.js";

describe('VideoGameValidators', () => {
  const getVideoGameByName = vi.fn()
  const getGenreList = vi.fn()
  initVideoGameValidators({
    getVideoGameByName, getGenreList
  })
  beforeEach(async () => vi.clearAllMocks())
  for (let field of ['name', 'genre', 'releaseDate', 'price']) {
    test(`validates ${field} to be required`, async () => {
      for (let value of ['', null, undefined]) {
        expect(await getFieldValidator(field)(value)).toEqual({
          success: false,
          errors: ['This field is required']
        })
      }
    })
  }

  test('validates name has at least 2 characters', async () => {
    expect(await getFieldValidator('name')('a')).toEqual({
      success: false,
      errors: ['This field should have a minimum length of 2']
    })
    expect(await getFieldValidator('name')('aa')).toEqual({
      success: true
    })
  })
  test('validates name has at least 2 characters', async () => {
    expect(await getFieldValidator('name')('a')).toEqual({
      success: false,
      errors: ['This field should have a minimum length of 2']
    })
    expect(await getFieldValidator('name')('aa')).toEqual({
      success: true
    })
  })
  test('validates name is not taken', async () => {
    getVideoGameByName.mockImplementation(() => ({}))
    expect(await getFieldValidator('name')('aa')).toEqual({
      success: false,
      errors: ['The game already exists']
    })
  })
  test('validates releaseDate is YYYY-MM-DD', async () => {
    expect(await getFieldValidator('releaseDate')('200-1-21-121')).toEqual({
      success: false,
      errors: ['The release date does not follow the given format']
    })
  })
  test('validates releaseDate is valid', async () => {
    expect(await getFieldValidator('releaseDate')('2001-21-21')).toEqual({
      success: false,
      errors: ['The release date is not a valid date']
    })
  })

  function tomorrow() {
    return new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString().substring(0, 10)
  }

  test('validates releaseDate not in future', async () => {
    expect(await getFieldValidator('releaseDate')(tomorrow())).toEqual({
      success: false,
      errors: ['The release date is set in the future']
    })
  })

  test('validates genre in list', async () => {
    getGenreList.mockImplementation(() => ([]))
    expect(await getFieldValidator('genre')('a-genre')).toEqual({
      success: false,
      errors: ['The genre a-genre is not a valid option']
    })
  })

  test('multiple errors', async () => {
    getVideoGameByName.mockImplementation(() => ({}))
    expect(await getFieldValidator('name')('a')).toEqual({
      success: false,
      errors: [
        'This field should have a minimum length of 2',
        'The game already exists'
      ]
    })
  })

  test('unknown field', async () => {
    expect(await getFieldValidator('unknown')('')).toEqual({
      success: true
    })
  })
})
