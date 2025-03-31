import {render} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import {useParams} from "react-router-dom";
import DeleteVideoGamePage from "../DeleteVideoGamePage.jsx";

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
describe("DeleteVideoGamePage", () => {
  test("does render VideoGameForm in the document", () => {

    vi.mocked(useParams).mockReturnValue({id: "123"})
    const {container} = render(<DeleteVideoGamePage/>)

    let videoGameForm = container.querySelector('[data-testid="video-game-form"]');
    expect(videoGameForm).toBeDefined();
    expect(JSON.parse(videoGameForm.innerHTML)).toEqual({mode: 'delete', id: '123'})
  });
});
