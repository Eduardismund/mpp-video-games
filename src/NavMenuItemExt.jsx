import {Link} from "react-router-dom";
import Icon from "./Icon.jsx";

/**
 *
 * @param {string} iconKey
 * @param {string} title
 * @param {string} description
 * @param {string} actionLabel
 * @param {string} actionRoute
 * @returns {JSX.Element}
 * @constructor
 */
function NavMenuItemSimple({iconKey, title, description, actionLabel, actionRoute}) {

  return (
    <>
      <Icon iconKey={iconKey} size={40}/>
      <div className="content">
        <div className="title"> {title}</div>
        <div className="description"> {description}</div>
        <div className="action">
          <Link to={actionRoute}>{actionLabel}</Link>
        </div>
      </div>
    </>
  )
}

export default NavMenuItemSimple
