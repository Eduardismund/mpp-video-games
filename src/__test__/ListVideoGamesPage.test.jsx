import {describe, expect, test, vi} from 'vitest'
import ListVideoGamesPage from "../ListVideoGamesPage.jsx";
import {fireEvent, render, waitFor} from "@testing-library/react";
import {getVideoGamesList, getVideoGameStatistics} from "../VideoGameStore.js";
import {getDictionary} from "../dictionary.js";

vi.mock('../VideoGameStore.js', () => ({
  getVideoGameStatistics: vi.fn(),
  getVideoGamesList: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  "Link": ({to, children}) => (<a href={to}>{children}</a>),
  getVideoGamesList: vi.fn()
}))

describe('ListVideoGamePage', () => {

  const dict = getDictionary('en')
  test('displays loading then no records', async () => {
    getVideoGameStatistics.mockImplementation(() => ({
      priceMetrics: {
        min: 0,
        max: 0,
        percentiles: [{p: 10, v: 0}, {p: 40, v: 0}, {p: 60, v: 0}, {p: 90, v: 0}]
      }
    }))
    getVideoGamesList.mockImplementation(() => ([]))
    const {container} = render(<ListVideoGamesPage/>)
    expect(container.innerHTML).toEqual('<p>Loading...</p>')
    await waitFor(() => {
      const table = container.querySelector('table')
      expect(table).toBeTruthy()
      expect(table.querySelector('tr>td').innerHTML).toEqual(dict.videoGamesList.messages.noResult)
    })
  })

  test('displays loading then records', async () => {
    getVideoGameStatistics.mockImplementation(() => ({ priceMetrics: {
        min: 10,
        max: 102,
        percentiles: [{p: 10, v: 11}, {p: 40, v: 50}, {p: 60, v: 70}, {p: 90, v: 102}]
      }
    }))
    getVideoGamesList.mockImplementation(() => ([
      {name: "Name1", genre: "Genre1", releaseDate: "RD1", price: 101.0102},
      {name: "Name2", genre: "Genre2", releaseDate: "RD2", price: 102.889}
    ]))
    const {container} = render(<ListVideoGamesPage/>)
    expect(container.innerHTML).toEqual('<p>Loading...</p>')
    await waitFor(() => {
      const table = container.querySelector('table')
      expect(table).toBeTruthy()
      const [item1, item2] = [...table.querySelectorAll('tbody>tr').values()]
      expect(item1.querySelector('td:nth-child(2)').innerHTML).toEqual("Name1")
      expect(item2.querySelector('td:nth-child(5)').innerHTML).toEqual("$102.89")
    })
  })

  test('filtering by price', async () => {
    getVideoGameStatistics.mockImplementation(() => ({ priceMetrics: {
        min: 10,
        max: 102,
        percentiles: [{p: 10, v: 10}, {p: 40, v: 50}, {p: 60, v: 70}, {p: 90, v: 102}]
      }
    }))
    getVideoGamesList.mockImplementation(() => ([
      {name: "Name1", genre: "Genre1", releaseDate: "RD1", price: 101.0102},
      {name: "Name2", genre: "Genre2", releaseDate: "RD2", price: 102.889}
    ]))
    const {container} = render(<ListVideoGamesPage/>)
    await waitFor(() => {
    })
    const table = container.querySelector('table')
    expect(table.querySelectorAll('tbody>tr').length).toBe(2)
    await waitFor(() => fireEvent.change(container.querySelector('input[type=range]'), {target: {value: 100}}))
    expect(getVideoGamesList).toHaveBeenCalledWith({maxPrice: 100})
  })

  test('highlights percentiles', async () => {
    getVideoGameStatistics.mockImplementation(() => ({ priceMetrics: {
        min: 10,
        max: 102,
        percentiles: [{p: 10, v: 10}, {p: 40, v: 50}, {p: 60, v: 70}, {p: 90, v: 102}]
      }
    }))
    getVideoGamesList.mockImplementation(() => ([
      {name: "P10", genre: "Genre1", releaseDate: "RD1", price: 9.0102},
      {name: "P10+", genre: "Genre2", releaseDate: "RD2", price: 31.889},
      {name: "P50", genre: "Genre1", releaseDate: "RD1", price: 51.0102},
      {name: "P50+", genre: "Genre2", releaseDate: "RD2", price: 80.889},
      {name: "P90", genre: "Genre2", releaseDate: "RD2", price: 102.889}
    ]))
    const {container} = render(<ListVideoGamesPage/>)
    await waitFor(() => {
    })
    const table = container.querySelector('table')
    expect(table.querySelector('tbody>tr:nth-child(1)').classList.value).toEqual('p10')
    expect(table.querySelector('tbody>tr:nth-child(2)').classList.value).toEqual('')
    expect(table.querySelector('tbody>tr:nth-child(3)').classList.value).toEqual('median')
    expect(table.querySelector('tbody>tr:nth-child(4)').classList.value).toEqual('')
    expect(table.querySelector('tbody>tr:nth-child(5)').classList.value).toEqual('p90')
  })
})
