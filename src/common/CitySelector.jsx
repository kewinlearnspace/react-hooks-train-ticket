import React, { useState, useMemo, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames' // 配置动态类插件
import './CitySelector.css'

// 对于只有纯粹属性输入的组件,一般都可以用 memo 来优化重复渲染性能
// 层次条目组件
const CityItem = memo(function CityItem(props) {
  const { name, onSelect } = props
  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      {name}
    </li>
  )
})
CityItem.propType = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

// 层次条目集合
const CitySection = memo(function CitySection(props) {
  const { title, cities = [], onSelect } = props
  return (
    <ul className="city-ul">
      <li className="city-li" key="title">
        {title}
      </li>
      {cities.map((city) => (
        <CityItem key={city.name} name={city.name} onSelect={onSelect}></CityItem>
      ))}
    </ul>
  )
})
CitySection.propType = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
}

// 列表组件
const CityList = memo(function CityList(props) {
  const { sections, onSelect } = props
  return (
    <div className="city-list">
      <div className="city-cate">
        {sections.map((section) => (
          <CitySection
            key={section.title}
            title={section.title}
            cities={section.citys}
            onSelect={onSelect}
          ></CitySection>
        ))}
      </div>
    </div>
  )
})
CityList.propType = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
}

const CitySelector = memo(function CitySelector(props) {
  const { show, cityData, isLoading, onBack, fetchCityData, onSelect } = props
  const [searchKey, setSearchKey] = useState('')
  // searchKey不变就不会重新计算key
  const key = useMemo(() => searchKey.trim(), [searchKey])

  useEffect(() => {
    // show列表未显示 cityData已存在 isLoading正在请求
    if (!show || cityData || isLoading) {
      return
    }
    fetchCityData()
  }, [show, cityData, isLoading])

  // CityList挂载到CitySelector上时部分数据可能不存在需要特殊处理
  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading</div>
    }
    // cityData数据请求回来才开始渲染CityList
    if (cityData) {
      return <CityList sections={cityData.cityList} onSelect={onSelect}></CityList>
    }
    return <div>Error</div>
  }

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
            <polyline points="25,13 16,21 25,29" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
            onChange={(e) => setSearchKey(e.target.value)}
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
      {outputCitySections()}
    </div>
  )
})

CitySelector.propType = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default CitySelector
