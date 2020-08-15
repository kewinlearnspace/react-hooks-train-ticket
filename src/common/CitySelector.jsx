import React, { useState, useMemo, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'; // 配置动态类插件
import './CitySelector.css';

/**
 * 对于只有纯粹属性输入的组件,一般都可以用 memo 来优化重复渲染性能
 */

// 搜索单个城市条目
const SuggestItem = memo(function SuggestItem(props) {
  const { name, onClick } = props;
  return (
    <li className="city-suggest-li" onClick={() => onClick(name)}>
      {name}
    </li>
  );
});
SuggestItem.propType = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// 搜索单个城市条目集合
const Suggest = memo(function Suggest(props) {
  const { searchKey, onSelect } = props;
  const [result, setResult] = useState([]);
  useEffect(() => {
    fetch('/rest/search?key=' + encodeURIComponent(searchKey))
      .then(res => res.json())
      .then(data => {
        const { result, searchKey: sKey } = data;
        // 避免多次请求时,无法确认那次请求先返回,所以对返回的搜索结果中的sKey与当前searchKey比较。保证仅展示当前searchKey搜索的内容
        if (sKey === searchKey) {
          setResult(result);
        }
      });
  }, [searchKey]);

  const fallBackResult = useMemo(() => {
    if (!result.length) {
      return [{ display: searchKey }];
    }
    return result;
  }, [result, searchKey]);
  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {fallBackResult.map(item => (
          <SuggestItem
            key={item.display}
            name={item.display}
            onClick={onSelect}
          ></SuggestItem>
        ))}
      </ul>
    </div>
  );
});
SuggestItem.propType = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// 层次条目组件
const CityItem = memo(function CityItem(props) {
  const { name, onSelect } = props;
  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      {name}
    </li>
  );
});
CityItem.propType = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// 层次条目集合
const CitySection = memo(function CitySection(props) {
  const { title, cities = [], onSelect } = props;
  return (
    <ul className="city-ul">
      {/* data-cate为html自定义属性 */}
      <li className="city-li" key="title" data-cate={title}>
        {title}
      </li>
      {cities.map(city => (
        // a
        <CityItem
          key={city.name}
          name={city.name}
          onSelect={onSelect}
        ></CityItem>
      ))}
    </ul>
  );
});
CitySection.propType = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
};

// 列表组件
const CityList = memo(function CityList(props) {
  const { sections, onSelect, toAlpha } = props;
  return (
    <div className="city-list">
      <div className="city-cate">
        {sections.map(section => (
          <CitySection
            key={section.title}
            title={section.title}
            cities={section.citys}
            onSelect={onSelect}
          ></CitySection>
        ))}
      </div>
      <div className="city-index">
        {alphabet.map(alpha => {
          return (
            <AlphaIndex
              key={alpha}
              alpha={alpha}
              onClick={toAlpha}
            ></AlphaIndex>
          );
        })}
      </div>
    </div>
  );
});
CityList.propType = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired,
};

// 右侧字母定位层组件
const AlphaIndex = memo(function AlphaIndex(props) {
  const { alpha, onClick } = props;
  return (
    <i className="city-index-item" onClick={() => onClick(alpha)}>
      {alpha}
    </i>
  );
});
AlphaIndex.prototype = {
  alpha: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// 26个英文字母的构建,主要通过ASCII值
const alphabet = Array.from(new Array(26), (ele, index) => {
  return String.fromCharCode(65 + index);
});

const CitySelector = memo(function CitySelector(props) {
  const { show, cityData, isLoading, onBack, fetchCityData, onSelect } = props;
  const [searchKey, setSearchKey] = useState('');
  // searchKey不变就不会重新计算key
  const key = useMemo(() => searchKey.trim(), [searchKey]);

  useEffect(() => {
    // show列表未显示 cityData已存在 isLoading正在请求
    if (!show || cityData || isLoading) {
      return;
    }
    fetchCityData();
  }, [show, cityData, isLoading]);

  // 不依赖变量所以为空
  const toAlpha = useCallback(alpha => {
    document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
  }, []);
  // CityList挂载到CitySelector上时部分数据可能不存在需要特殊处理
  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading</div>;
    }
    // cityData数据请求回来才开始渲染CityList
    if (cityData) {
      return (
        <CityList
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        ></CityList>
      );
    }
    return <div>Error</div>;
  };

  /**
   * className={['city-selector', !show && 'hidden'].filter(Boolean).join(' ')}></div>
   * 等价于
   *  ['city-selector', !show && 'hidden'].filter(Boolean).join(' ')
   */
  return (
    <div className={classnames('city-selector', { hidden: !show })}>
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
          className={classnames('search-clean', {
            hidden: key.length === 0,
          })}
          onClick={() => setSearchKey('')}
        >
          &#xf063;
        </i>
      </div>
      {Boolean(key) && (
        <Suggest searchKey={key} onSelect={key => onSelect(key)}></Suggest>
      )}
      {outputCitySections()}
    </div>
  );
});

CitySelector.propType = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CitySelector;
