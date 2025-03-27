import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, List, PlusCircle, Edit, Trash2 } from "lucide-react";
import NavMenu from "./NavMenu.jsx";

function SidePanel() {
  return (
    <div className="side-panel">
      <NavMenu mode="simple" />
    </div>
  );
}

export default SidePanel;
