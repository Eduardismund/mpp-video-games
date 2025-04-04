import {Gamepad2} from "lucide-react";
import {getDictionary} from "./dictionary.js";
import React from "react";
import StoreSwitch from "./StoreSwitch.jsx";

function Header() {
  return (
    <header className="header">
      <Gamepad2 size={54} className="icon" />
      <h1 className="title">{getDictionary('en').appTitle}</h1>
      <StoreSwitch/>

    </header>

  );
}

export default Header;
