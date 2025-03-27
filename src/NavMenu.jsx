import {getDictionary} from "./dictionary.js";
import NavMenuItemSimple from "./NavMenuItemSimple.jsx";
import NavMenuItemExt from "./NavMenuItemExt.jsx";

/**
 *
 * @param {'simple' | 'ext'} mode
 * @constructor
 */
function NavMenu({mode}) {
  const navMenu = getDictionary("en").navMenu;
  var navMenuArray = Object.keys(navMenu).map(key => ({key, ...navMenu[key]}))
  if (mode === "ext") {
    navMenuArray = navMenuArray.filter(menuItem => menuItem.key !== "home")
  }
  return (
    <>
      <ul className={"nav-menu " + mode}>
        {navMenuArray.map(item =>
          <li key={item.key} className={item.key}>
            {mode === 'ext'
              ? <NavMenuItemExt iconKey={item.key} title={item.title} description={item.description}
                                actionLabel={item.actionLabel} actionRoute={"/" + item.key}/>
              : <NavMenuItemSimple iconKey={item.key} title={item.shortTitle} actionRoute={"/" + item.key}/>}
          </li>
        )}
      </ul>
    </>
  )
}

export default NavMenu
