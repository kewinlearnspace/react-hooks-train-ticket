import React, { memo } from 'react';
import Proptypes from 'prop-types';
import classnames from 'classnames';
import './Menu.css';

const MenuItem = memo(function MenuItem(props) {
  const { onPress, title, value, active } = props;
  return (
    <li className={classnames({ active })} onClick={() => onPress(value)}>
      {title}
    </li>
  );
});
MenuItem.prototype = {
  onPress: Proptypes.func.isRequired,
  title: Proptypes.string.isRequired,
  value: Proptypes.oneOfType([Proptypes.string, Proptypes.number]).isRequired,
  active: Proptypes.bool.isRequired,
};

const Menu = memo(function Menu(props) {
  const { show, options, onPress, hideMenu } = props;
  return (
    <div>
      {show && <div className="menu-mask" onClick={() => hideMenu()}></div>}
      <div className={classnames('menu', { show })}>
        <div className="menu-title"></div>
        <ul>
          {options &&
            options.map(option => (
              <MenuItem
                key={option.value}
                {...option}
                onPress={onPress}
              ></MenuItem>
            ))}
        </ul>
      </div>
    </div>
  );
});

Menu.prototype = {
  show: Proptypes.bool.isRequired,
  options: Proptypes.array.isRequired,
  onPress: Proptypes.func.isRequired,
  hideMenu: Proptypes.func.isRequired,
};
export default Menu;
