import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames"; // 配置动态类插件
import "./CitySelector.css";

function CitySelector(props) {
  const { show, cityData, isLoading, onBack, fetchCityData } = props;
  const [searchKey, setSearchKey] = useState("");
  // searchKey不变就不会重新计算key
  const key = useMemo(() => searchKey.trim(), [searchKey]);

  useEffect(() => {
    // show列表未显示 cityData已存在 isLoading正在请求
    if (!show || cityData || isLoading) {
      return;
    }
    fetchCityData();
  }, [show, cityData, isLoading]);

  /**
   * className={['city-selector', !show && 'hidden'].filter(Boolean).join(' ')}></div>
   * 等价于
   *  ['city-selector', !show && 'hidden'].filter(Boolean).join(' ')
   */
  return (
    <div className={classnames("city-selector", { hidden: !show })}>
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
            onChange={e => setSearchKey(e.target.value)}
          />
        </div>
        <i
          className={classnames("search-clean", {
            hidden: key.length === 0
          })}
          onClick={() => setSearchKey("")}
        >
          &#xf063;
        </i>
      </div>
    </div>
  );
}

CitySelector.propType = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired
};

export default CitySelector;
