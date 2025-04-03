import {render, fireEvent, waitFor} from '@testing-library/react'
import {vi, expect, test, describe, beforeEach} from 'vitest'
import VideoGameLookup from '../VideoGameLookup.jsx'
import {getDictionary} from '../dictionary.js'


vi.mock('../RemoteVideoGameStore.js', () => ({
  'getVideoGameByName': async (name) => name === 'Found VG' ? {id: 'vg-id'} : undefined
}))

const mockShowToast = vi.fn()

vi.mock('../ToastContext.jsx', () => ({
  'useToast': () => ({
    showToast: mockShowToast
  })
}))

const mockOnGameFound = vi.fn()

describe('VideoGameLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  let dict = getDictionary('en')
  const renderTestModes = [
    {mode: 'update'},
    {mode: 'delete'},
  ]
  renderTestModes.forEach(renderTestMode =>
    test(`renders correctly for mode ${renderTestMode.mode}`, async () => {
      const {container} = render(<VideoGameLookup mode={renderTestMode.mode} onGameFound={mockOnGameFound}/>)
      const label = container.querySelector('label')
      expect(label).toBeTruthy()
      expect(label.innerHTML).toEqual(dict.videoGameLookup.labelFor[renderTestMode.mode])
      const searchInput = container.querySelector('input[placeholder]')
      expect(searchInput).toBeTruthy()
      expect(searchInput.placeholder).toEqual(dict.videoGameLookup.searchInput.placeholder)
      const button = container.querySelector('button[type=submit]')
      expect(button).toBeTruthy()
      expect(button.innerHTML).toEqual(dict.videoGameLookup.searchButton.label)
    })
  )
  test('call callback on game found', async () => {
    const {container} = render(<VideoGameLookup mode="update" onGameFound={mockOnGameFound}/>)
    const searchInput = container.querySelector(`input[placeholder='${dict.videoGameLookup.searchInput.placeholder}']`)
    fireEvent.change(searchInput, {target: {value: "Found VG"}})
    fireEvent.click(container.querySelector(`button[type=submit]`))
    await waitFor(() => {
      expect(mockOnGameFound).toHaveBeenCalledWith({id: 'vg-id'})
      expect(mockShowToast).not.toHaveBeenCalled()
    })
  })
  test('shows toast on empty game name input', async () => {
    const {container} = render(<VideoGameLookup mode="delete" onGameFound={mockOnGameFound}/>)
    fireEvent.click(container.querySelector('button[type=submit]'))
    expect(mockShowToast).toHaveBeenCalledWith(dict.videoGameLookup.messages.nameRequired, 'info')
    expect(mockOnGameFound).not.toHaveBeenCalled()
  })
  test('shows toast on game not found', async () => {
    const {container} = render(<VideoGameLookup mode="delete" onGameFound={mockOnGameFound}/>)
    fireEvent.change(container.querySelector('input[placeholder]'), {target: {value: "Not Found VG"}})
    fireEvent.click(container.querySelector('button[type=submit]'))
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(dict.videoGameLookup.messages.noResult, 'info')
      expect(mockOnGameFound).not.toHaveBeenCalled()
    })
  })
  test('shows toast on unexpected error', async () => {
    mockOnGameFound.mockImplementation( () => {
      throw new Error()
    })
    const {container} = render(<VideoGameLookup mode="update" onGameFound={mockOnGameFound}/>)
    fireEvent.change(container.querySelector('input[placeholder]'), {target: {value: "Found VG"}})
    fireEvent.click(container.querySelector('button[type=submit]'))
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(dict.videoGameLookup.messages.unexpectedError, 'error')
    })
  })
})
