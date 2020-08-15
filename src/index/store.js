import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

/**
 * @param
 * combineReducers:
 * {}: 设置默认的参数
 * applyMiddleware: 异步请求
 */
export default createStore(
  combineReducers(reducers),
  {
    from: '北京', // 起点站
    to: '上海', // 终点站
    isCitySelectorVisible: false, // 控制城市选择是否显示
    currentSelectingLeftCity: false, // 选择数据后回填的地方 => from 或者 to
    cityData: null, // 所有的城市数据
    isLoadingCityData: false, // 是否在加载城市数据
    isDateSelectorVisible: false, // 控制日期选择器是否显示
    departDate: Date.now(),
    highSpeed: false, // 高铁或动车
  },
  applyMiddleware(thunk)
);
