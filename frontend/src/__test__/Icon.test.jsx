import {render} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import Icon from "../Icon.jsx";
import {Edit, Home, List, PlusCircle, Trash} from "lucide-react";

const icons = [
  { key: "add-video-game", component: PlusCircle },
  { key: "update-video-game", component: Edit },
  { key: "list-video-games", component: List },
  { key: "delete-video-game", component: Trash },
  { key: "home", component: Home },
];

describe("Icon Component", () => {
  icons.forEach(({ key }) => {
    test(`renders the correct icon for '${key}'`, () => {
      const { container } = render(<Icon iconKey={key} size={24} />);
      expect(container.querySelector("svg.icon[width='24'][height='24']")).toBeDefined();
    });
  });

  test("renders empty string for an unknown iconKey", () => {
    const { container } = render(<Icon iconKey="unknown-key" size={24} />);
    expect(container.innerHTML).toBe("");
  });
});
