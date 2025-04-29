import NavMenu from "./NavMenu.jsx";
import {Menu} from "lucide-react";

function SidePanel() {

  function sidePanelToggle(e) {
    e.preventDefault()
    const sidePanel = document.querySelector('.side-panel')
    if (sidePanel.classList.contains('contracted')) {
      sidePanel.classList.remove('contracted')
    } else {
      sidePanel.classList.add('contracted')
    }
  }

  return (
    <div className="side-panel">
      <a href="#" className="side-panel-toggle" onClick={sidePanelToggle}><Menu/></a>
      <NavMenu mode="simple"/>
    </div>
  );
}

export default SidePanel;
