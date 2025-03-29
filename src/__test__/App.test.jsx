// noinspection JSCheckFunctionSignatures

import React from "react";
import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import App from "../App";
import {userEvent} from "@testing-library/user-event";
import '@testing-library/jest-dom'
import {getDictionary} from "../dictionary.js";

const dict = getDictionary('en')

describe('App', async () => {

  function expectHomePage() {
    expect(screen.getByText(dict.appTitle)).toBeInTheDocument()
    Object.keys(dict.navMenu).map(key => dict.navMenu[key])
      .flatMap(item => [item.title, item.description, item.shortTitle, item.actionLabel])
      .filter(text => !!text)
      .forEach(text =>
        expect(screen.getByText(text)).toBeInTheDocument())
  }

  async function startInHome() {
    render(<App/>)
    const user = userEvent.setup()
    await user.click(screen.getByText(dict.navMenu.home.shortTitle))
    expectHomePage()
  }

  test('can navigate to home', async () => {
    await startInHome()
    expectHomePage()
  })

  test('can navigate to list-video-games', async () => {
    render(<App/>)
    const user = userEvent.setup()
    await user.click(screen.getByText(dict.navMenu['list-video-games'].shortTitle))
    expect(screen.getByRole('table')).toBeInTheDocument()
    await user.click(screen.getByText(dict.navMenu.home.shortTitle))
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
        const user = userEvent.setup()
        await user.click(screen.getByText(dict.navMenu[testItem.menuKey].shortTitle))
        expect(screen.getByText(testItem.expected)).toBeInTheDocument()
        await user.click(screen.getByText(dict.navMenu.home.shortTitle))
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
        const user = userEvent.setup()
        await user.click(screen.getByText(dict.navMenu[testItem.menuKey].actionLabel))
        expect(screen.getByText(testItem.expected)).toBeInTheDocument()
        await user.click(screen.getByText(dict.navMenu.home.shortTitle))
        expectHomePage()
      })
    })


})
