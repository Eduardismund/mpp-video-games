import {render, fireEvent} from "@testing-library/react";
import {vi, expect, test, describe} from 'vitest'
import {SearchVideoGameForUpdatePage} from "../SearchVideoGameForUpdatePage.jsx";
import {SearchVideoGameForDeletePage} from "../SearchVideoGameForDeletePage.jsx";

vi.mock("../VideoGameLookup.jsx", () => ({
  default: (params) => (
    <div onClick={() => params.onGameFound({ id: 'vg-id' })}
         data-testid="videogame-looukup">{JSON.stringify(params)}</div>
  ),
}))

// Mock useNavigate once, not inside the loop
const mockNavigate = vi.fn();
// noinspection JSUnusedGlobalSymbols
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe("SearchVideoGameForXPage", () => {
  // Mock the VideoGameLookup component

  const testData = [
    {
      mode: 'update',
      renderer: () => (<SearchVideoGameForUpdatePage />),
    },
    {
      mode: 'delete',
      renderer: () => (<SearchVideoGameForDeletePage />),
    },
  ]

  testData.forEach((testDataItem) => {
    test(`for ${testDataItem.mode} does render VideoGameLookup in the document`, () => {
      const { container } = render(testDataItem.renderer()  );

      // Find the VideoGameLookup component
      const vgLookup = container.querySelector('[data-testid="videogame-looukup"]');
      expect(vgLookup).toBeTruthy();

      // Check if the mode is passed correctly to the VideoGameLookup
      expect(vgLookup.innerHTML).toEqual(JSON.stringify({ mode: testDataItem.mode }));

      // Simulate the click
      fireEvent.click(vgLookup);

      // Check if navigate was called with the correct URL
      expect(mockNavigate).toHaveBeenCalledWith(`/${testDataItem.mode}-video-game/vg-id`);
    })
  })
})
