import {Link} from "react-router-dom";
import Icon from "./Icon.jsx";

/**
 *
 * @param {string} iconKey
 * @param {string} title
 * @param {string} actionRoute
 * @returns {JSX.Element}
 * @constructor
 */
function NavMenuItemSimple({iconKey, title, actionRoute}) {

  return (
    <>
      <Link to={actionRoute}><Icon iconKey={iconKey} size={20}/><span>{title}</span></Link>
    </>
  )
}

export default NavMenuItemSimple
