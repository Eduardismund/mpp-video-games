import {Gamepad2} from "lucide-react";

function Header() {
  return (
    <header className="header">
      <Gamepad2 size={54} className="icon" />
      <h1 className="title">Game Library</h1>
    </header>
  );
}

export default Header;
