import React from "react";
import {render} from "@testing-library/react";
import {vi, expect, test, describe} from 'vitest'
import {useParams} from "react-router-dom";
import UpdateVideoGamePage from "../UpdateVideoGamePage.jsx";

vi.mock("../VideoGameForm.jsx", () => ({
  default: (params) => <div data-testid="video-game-form">
    {JSON.stringify(params)}
  </div>
}));

vi.mock("react-router-dom", async () => {
  return {
    useParams: vi.fn(),
  };
});
describe("UpdateVideoGamePage", () => {
  test("does render VideoGameForm in the document", () => {

    vi.mocked(useParams).mockReturnValue({id: "123"})
    const {container} = render(<UpdateVideoGamePage/>)

    let videoGameForm = container.querySelector('[data-testid="video-game-form"]');
    expect(videoGameForm).toBeDefined();
    expect(JSON.parse(videoGameForm.innerHTML)).toEqual({mode: 'update', id: '123'})
  });
});
