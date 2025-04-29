// noinspection JSCheckFunctionSignatures

import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import App from "../App.jsx";
import {getDictionary} from "../dictionary.js";

const dict = getDictionary('en')

vi.mock('../VideoGameStatisticsChart.jsx', () => ({
  default: () => <div className="vg-chart"></div>,
}))

vi.mock('../WrapperVideoGameStore.js', async () => ({
  videoGameStore: {
    getVideoGameStatistics: () => ({priceMetrics: {max: 100, min: 0, percentiles: []}}),
    getVideoGamesList: () => ({items: [], totalCount: 0}),
    getGenreList: () => (["Action"])
  }
}))

describe('App', async () => {

  function expectHomePage() {
    expect(screen.getByText(dict.appTitle)).toBeTruthy()
    Object.keys(dict.navMenu).map(key => dict.navMenu[key])
      .flatMap(item => [item.title, item.description, item.shortTitle, item.actionLabel])
      .filter(text => !!text)
      .forEach(text =>
        expect(screen.getByText(text)).toBeTruthy())
  }

  async function startInHome() {
    render(<App/>)
    fireEvent.click(screen.getByText(dict.navMenu.home.shortTitle))
    expectHomePage()
  }

  test('can navigate to home', async () => {
    await startInHome()
    expectHomePage()
  })

  test('can navigate to list-video-games', async () => {
    render(<App/>)
    await waitFor(() => {
    })
    fireEvent.click(screen.getByText(dict.navMenu['list-video-games'].shortTitle))
    expect(screen.getByText('Loading...')).toBeTruthy()
    await waitFor(() => {
    })
    await waitFor(() => {
    })
    fireEvent.click(screen.getByText(dict.navMenu.home.shortTitle))
    expectHomePage()
  })

  const sidePanelNavTestItems = [
    {menuKey: 'add-video-game', expected: dict.videoGameFields.name.inputName},
    {menuKey: 'update-video-game', expected: dict.videoGameLookup.labelFor.update},
    {menuKey: 'delete-video-game', expected: dict.videoGameLookup.labelFor.delete}
  ]
  sidePanelNavTestItems
    .forEach(testItem => {
      test(`can navigate to ${testItem.menuKey} from side-panel`, async () => {
        render(<App/>)
        fireEvent.click(screen.getByText(dict.navMenu[testItem.menuKey].shortTitle))
        expect(screen.getByText(testItem.expected)).toBeTruthy()
        fireEvent.click(screen.getByText(dict.navMenu.home.shortTitle))
        expectHomePage()
      })
    })

  const homeSceneNavTestItems = [
    {menuKey: 'add-video-game', expected: dict.videoGameFields.name.inputName},
    {menuKey: 'update-video-game', expected: dict.videoGameLookup.labelFor.update},
    {menuKey: 'delete-video-game', expected: dict.videoGameLookup.labelFor.delete}
  ]
  homeSceneNavTestItems
    .forEach(testItem => {
      test(`can navigate to ${testItem.menuKey} from home`, async () => {
        await startInHome()
        fireEvent.click(screen.getByText(dict.navMenu[testItem.menuKey].actionLabel))
        expect(screen.getByText(testItem.expected)).toBeTruthy()
        fireEvent.click(screen.getByText(dict.navMenu.home.shortTitle))
        expectHomePage()
      })
    })


})
