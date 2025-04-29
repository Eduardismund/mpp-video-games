import {render} from "@testing-library/react";
import {vi, expect, test, describe} from 'vitest'
import AddVideoGamePage from "../AddVideoGamePage.jsx";

vi.mock("../VideoGameForm.jsx", () => ({
  default: (params) => <div  data-testid="video-game-form">
    {JSON.stringify(params)}
  </div>,
}));

describe("AddVideoGamePage", () => {
  test("does render VideoGameForm in the document", () => {
    const {container} = render(<AddVideoGamePage/>);
    let videoGameForm = container.querySelector('[data-testid="video-game-form"]');
    expect(videoGameForm).toBeTruthy;
    expect(videoGameForm.innerHTML).toEqual(JSON.stringify({mode:'create'}))
  });
});
