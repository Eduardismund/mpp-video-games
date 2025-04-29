import { useEffect, useState } from 'react';
import { getDictionary } from './dictionary.js';
import NavMenuItemSimple from './NavMenuItemSimple.jsx';
import NavMenuItemExt from './NavMenuItemExt.jsx';

/**
 * @param {'simple' | 'ext'} mode
 * @constructor
 */
function NavMenu({ mode }) {
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [navMenuArray, setNavMenuArray] = useState([]);

  useEffect(() => {
    const updateNavMenu = () => {
      const currentRole = sessionStorage.getItem('role');
      setRole(currentRole);
    };

    const interval = setInterval(() => {
      const newRole = sessionStorage.getItem('role');
      if (newRole !== role) {
        updateNavMenu();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    const navMenu = getDictionary('en').navMenu;
    let newNavMenuArray = Object.keys(navMenu).map((key) => ({ key, ...navMenu[key] }));

    if (mode === 'ext') {
      newNavMenuArray = newNavMenuArray.filter(
        (menuItem) =>
          menuItem.key !== 'home' && menuItem.key !== 'login' && menuItem.key !== 'monitor-users'
      );
    } else if (!role || role === '1') {
      newNavMenuArray = newNavMenuArray.filter(
        (menuItem) =>
          menuItem.key !== 'add-video-game' &&
          menuItem.key !== 'update-video-game' &&
          menuItem.key !== 'delete-video-game'
      );
    } else if (role === '0') {
      newNavMenuArray = newNavMenuArray.filter((menuItem) => menuItem.key !== 'monitor-users');
    }

    setNavMenuArray(newNavMenuArray);
  }, [role, mode]);

  return (
    <>
      <ul className={'nav-menu ' + mode}>
        {navMenuArray.map((item) => (
          <li key={item.key} className={item.key}>
            {mode === 'ext' ? (
              <NavMenuItemExt
                iconKey={item.key}
                title={item.title}
                description={item.description}
                actionLabel={item.actionLabel}
                actionRoute={'/' + item.key}
              />
            ) : (
              <NavMenuItemSimple
                iconKey={item.key}
                title={item.shortTitle}
                actionRoute={'/' + item.key}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default NavMenu;
