import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./DateSelector.css";

import Header from "./Header.jsx";

export default function DateSelector(props) {
  const { show, onSelect, onBack } = props;
  return (
    <div className={classnames("date-selector", { hidden: !show })}>
      <Header title="日期选择" onBack={onBack}></Header>
      <div className="date-selector-tables"></div>
    </div>
  );
}

DateSelector.prototype = {
  show: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};
