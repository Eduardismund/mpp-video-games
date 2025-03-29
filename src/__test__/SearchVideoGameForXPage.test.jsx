import React from "react";
import {render} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import {SearchVideoGameForUpdatePage} from "../SearchVideoGameForUpdatePage.jsx";
import {SearchVideoGameForDeletePage} from "../SearchVideoGameForDeletePage.jsx";

vi.mock("../VideoGameLookup.jsx", () => ({
  default: (params) => <div data-testid="videogame-looukup">{JSON.stringify(params)}</div>,
}))

vi.mock("react-router-dom", async () => {
  return {
    useNavigate: vi.fn(),
  };
});

describe("SearchVideoGameForXPage", () => {
  const testData = [
    {
      mode: 'update',
      renderer: () => (<SearchVideoGameForUpdatePage/>)
    },
    {
      mode: 'delete',
      renderer: () => (<SearchVideoGameForDeletePage/>)
    }
  ]
  testData.forEach(testDataItem => {
    test(`for ${testDataItem.mode} does render VideoGameLookup in the document`, () => {
      const {container} = render(testDataItem.renderer());
      let vgLookup = container.querySelector('[data-testid="videogame-looukup"]');
      expect(vgLookup).toBeDefined();
      expect(vgLookup.innerHTML).toEqual(JSON.stringify({mode: testDataItem.mode}))
    })
  })

})
