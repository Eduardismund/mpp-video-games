
import {Edit, PlusCircle, Trash, List, Home, LogIn, MonitorIcon, User2Icon} from "lucide-react";

function getIcon(key, size) {
  switch (key) {
    case "add-video-game":
      return <PlusCircle size={size} className="icon" />;
    case "update-video-game":
      return <Edit size={size} className="icon" />;
    case "list-video-games":
      return <List size={size} className="icon" />;
    case "delete-video-game":
      return <Trash size={size} className="icon" />;
    case "home":
      return <Home size={size} className="icon" />;
    case "login":
      return <LogIn size={size} className="icon" />;
    case "monitor-users":
      return <MonitorIcon size={size} className="icon" />;
    case "active-user-sessions":
      return <User2Icon size={size} className="icon" />;
    default:
     return ''

  }
}

/**
 *
 * @param {string} iconKey
 * @param {number} size
 * @returns {JSX.Element}
 * @constructor
 */
function Icon({iconKey, size}) {
  return (
    <>
      {getIcon(iconKey, size)}
    </>
  )
}

export default Icon
