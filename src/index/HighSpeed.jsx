import React, { memo } from 'react';
import classnames from 'classnames';
import Prototype from 'prop-types';
import './HighSpeed.css';

const HighSpeed = memo(function HighSpeed(props) {
  const { highSpeed, toggle } = props;
  return (
    <div className="high-speed">
      <div className="high-speed-label">只看高铁/动车</div>
      <div className="high-speed-switch" onClick={() => toggle()}>
        <input type="hidden" name="highSpeed" value={highSpeed} />
        <div className={classnames('high-speed-track', { checked: highSpeed })}>
          <span
            className={classnames('high-speed-handle', { checked: highSpeed })}
          ></span>
        </div>
      </div>
    </div>
  );
});

HighSpeed.prototype = {
  highSpeed: Prototype.bool.isRequired,
  toggle: Prototype.func.isRequired,
};
export default HighSpeed;
