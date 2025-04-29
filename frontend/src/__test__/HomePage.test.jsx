import React from "react";
import {render} from "@testing-library/react";
import {describe, test, expect, vi} from "vitest";
import HomePage from "../HomePage.jsx";

vi.mock("../NavMenu.jsx", () => ({
  default: (params) => <div className="nav-menu">{JSON.stringify(params)}</div>,
}));

describe("HomePage", () => {
  test("does render NavMenu in the document", () => {
    const {container} = render(<HomePage/>);
    let videoGameForm = container.querySelector('.nav-menu');
    expect(videoGameForm).toBeDefined();
    expect(videoGameForm.innerHTML).toEqual(JSON.stringify({mode: 'ext'}))
  });
});
