import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

export default createStore(
  combineReducers(reducers),
  {
    // 设置stroe的初始值
    departDate: Date.now(), // 出发日期
    arriveDate: Date.now(), // 到达日期
    departTimeStr: null, // 出发时间
    arriveTimeStr: null, // 到达时间
    departStation: null, // 出发站
    arriveStation: null, // 终点站
    trainNumber: null, // 车次
    durationStr: null, // 运行时间
    tickets: [],
    isScheduleVisible: false, // 浮层是否显示
    searchParsed: false, // 控制页面的异步请求
  },
  applyMiddleware(thunk)
);
