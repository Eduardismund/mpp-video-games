import {beforeEach, describe, expect, test, vi} from 'vitest'
import {getDictionary} from '../dictionary.js'
import VideoGameForm from "../VideoGameForm.jsx";
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import {addVideoGame, deleteVideoGame, getVideoGameByName, updateVideoGame} from "../RemoteVideoGameStore.js";
import {initVideoGameValidators} from "../VideoGameValidators.js";
import {getGenreList} from "../GenreStore.js";

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  'useNavigate': () => mockNavigate
}))

vi.mock('../GenreStore.js', () => ({
  'getGenreList': async () => ['genre-1', 'genre-2']
}))


vi.mock('../RemoteVideoGameStore.js', () => ({
  'getVideoGameById': async id => {
    if (id === 'id-1') {
      return {
        id: 'id-1',
        name: 'name-1',
        genre: 'genre-1',
        releaseDate: '2023-12-23',
        price: 102.121
      }
    }
    return undefined
  },
  'getVideoGameByName': async () => undefined,
  'updateVideoGame': vi.fn(),
  'addVideoGame': vi.fn(),
  'deleteVideoGame': vi.fn(),
}))

const mockShowToast = vi.fn()
const mockConfirmation = vi.fn()

vi.mock('../ToastContext.jsx', () => ({
  'useToast': () => ({
    showToast: mockShowToast,
    showConfirmation: mockConfirmation
  })
}))


describe('VideoGameForm', () => {
  initVideoGameValidators({getVideoGameByName, getGenreList})
  beforeEach(() => {
    vi.resetAllMocks()
  })
  const dict = getDictionary('en')
  test('renders in add mode', async () => {
    const {container} = render(<VideoGameForm mode="create"/>)
    await waitFor(() => {
    })
    Object.keys(dict.videoGameFields).forEach(field => {
      expect(container.querySelector(`.${field} label`).innerHTML).toEqual(dict.videoGameFields[field].inputName)
    })
    expect(container.querySelector(`.name input`).readOnly).toEqual(false)
  })
  test('renders in update mode', async () => {
    const {container} = render(<VideoGameForm id="vg-id" mode="update"/>)
    await waitFor(() => {
    })
    Object.keys(dict.videoGameFields).forEach(field => {
      expect(container.querySelector(`.${field} label`).innerHTML).toEqual(dict.videoGameFields[field].inputName)
    })
    expect(container.querySelector(`.name input`).readOnly).toEqual(true)
  })
  test('renders in delete mode', async () => {
    const {container} = render(<VideoGameForm id="vg-id" mode="delete"/>)
    await waitFor(() => {
    })
    Object.keys(dict.videoGameFields).forEach(field => {
      expect(container.querySelector(`.${field} label`).innerHTML).toEqual(dict.videoGameFields[field].shortName)
    })
    expect(container.querySelector(`.name input`).disabled).toEqual(true)
    expect(container.querySelector(`.genre select`).disabled).toEqual(true)
    expect(container.querySelector(`.releaseDate input`).disabled).toEqual(true)
    expect(container.querySelector(`.price input`).disabled).toEqual(true)
  })
  test('shows toast when video game not found in update mode', async () => {

    render(<VideoGameForm id="non-existent-id" mode="update"/>)
    await waitFor(() => {
    })
    expect(mockShowToast).toHaveBeenCalledWith("Video game not found!", "error")
  })
  test('shows toast when video game not found in delete mode', async () => {

    render(<VideoGameForm id="non-existent-id" mode="delete"/>)
    await waitFor(() => {
    })
    expect(mockShowToast).toHaveBeenCalledWith("Video game not found!", "error")
  })

  test('loads data into form if video-game found', async () => {
    const {container} = render(<VideoGameForm id="id-1" mode="update"/>)
    await waitFor(() => {
    })
    expect(container.querySelector(`.name input`).value).toEqual('name-1')
    expect(container.querySelector(`.genre select`).value).toEqual('genre-1')
    expect(container.querySelector(`.releaseDate input`).value).toEqual('2023-12-23')
    expect(container.querySelector(`.price input`).value).toEqual('102.121')
  })

  test('show error messages on submit with untouched add form', async () => {
    const {container} = render(<VideoGameForm mode="create"/>)
    await waitFor(() => container.querySelector('button[type=submit]').click())
    expect(container.querySelector('.name .error').innerHTML).toEqual('This field is required')
    expect(container.querySelector('.genre .error').innerHTML).toEqual('This field is required')
    expect(container.querySelector('.releaseDate .error').innerHTML).toEqual('This field is required')
    expect(container.querySelector('.price .error').innerHTML).toEqual('This field is required')
    expect(container.querySelector('button[type=submit]').disabled).toEqual(true)
  })

  test('show error message on value changed', async () => {
    const {container} = render(<VideoGameForm mode="create"/>)
    await waitFor(() => fireEvent.change(container.querySelector('.price input'), {target: {value: 'one hundred'}}))
    expect(container.querySelector('.price .error').innerHTML).toEqual('The price is not valid')
  })


  test('remove error messages once the issue has been solved', async () => {
    const {container} = render(<VideoGameForm id="id-1" mode="update"/>)
    await waitFor(() => {
    })
    await act(() => fireEvent.change(container.querySelector('.releaseDate input'), {target: {value: '2026-26-26'}}))
    expect(container.querySelector('.releaseDate .error').innerHTML).toEqual('The release date is not a valid date')
    await act(() => fireEvent.change(container.querySelector('.releaseDate input'), {target: {value: '2023-12-23'}}))
    expect(container.querySelector('.releaseDate .error')).toBeFalsy()
  })

  test("doesn't crush on unexpected mode", async () => {
    const {container} = render(<VideoGameForm mode="add"/>)
    await waitFor(() => {
    })
    expect(container.querySelector('button[type=submit]').innerHTML).toEqual('Submit')
  })

  /**
   *
   * @param  {HTMLElement}container
   */
  function fillFormAndSubmit(container) {
    fireEvent.change(container.querySelector('.genre select'), {target: {value: 'genre-2'}})
    fireEvent.change(container.querySelector('.releaseDate input'), {target: {value: '2023-03-12'}})
    fireEvent.change(container.querySelector('.price input'), {target: {value: '9.99'}})
    fireEvent.click(container.querySelector('button[type=submit]'))
  }

  test("add video game to store on submit on create mode", async () => {
    const {container} = render(<VideoGameForm mode="create"/>)
    await waitFor(() => {
    })

    addVideoGame.mockImplementation(() => 'new-id')
    await act(() => {
      fireEvent.change(container.querySelector('.name input'), {target: {value: 'new-name'}})
      fillFormAndSubmit(container)
    })
    expect(addVideoGame).toHaveBeenCalledWith({
      name: 'new-name',
      genre: 'genre-2',
      releaseDate: '2023-03-12',
      price: 9.99
    })
    expect(mockNavigate).toHaveBeenCalledWith('/update-video-game/new-id')
  })

  test("update video game in store on submit on update mode", async () => {
    const {container} = render(<VideoGameForm mode="update" id="id-1"/>)
    await waitFor(() => {
    })
    await act(() => fillFormAndSubmit(container))
    expect(updateVideoGame).toHaveBeenCalledWith({
      id: 'id-1',
      name: 'name-1',
      genre: 'genre-2',
      releaseDate: '2023-03-12',
      price: 9.99
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
  test("delete video game in store on submit on delete mode", async () => {
    const {container} = render(<VideoGameForm mode="delete" id="id-1"/>)
    mockConfirmation.mockImplementation(({onConfirm}) => onConfirm())
    await waitFor(() => {
    })
    await act(() => fireEvent.click(container.querySelector('button[type=submit]')))
    expect(mockConfirmation).toHaveBeenCalled()
    expect(deleteVideoGame).toHaveBeenCalledWith('id-1')
    expect(mockNavigate).toHaveBeenCalledWith('/list-video-games')
  })
})
