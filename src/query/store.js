import { createStore, combineReducers, applyMiddleware } from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

import { h0 } from '../common/fp';
import { ORDER_DEPART } from './constant.js';

export default createStore(
  combineReducers(reducers),
  {
    from: null,
    to: null,
    departDate: h0(Date.now()),
    highSpeed: false,
    trainList: [], // 列车列表
    orderType: ORDER_DEPART, // 排序类型
    onlyTickets: false, // 只看有票
    ticketTypes: [], // 坐席类型- 所有备选项
    checkedTicketTypes: {}, // 坐席类型 - 被选中坐席
    trainTypes: [], // 车次类型 - 所有车次
    checkedTrainTypes: {}, // 车次类型 - 被选中的车次类型
    departStations: [], // 出发车站
    checkedDepartStations: {}, // 被选中的出发车站
    arriveStations: [], // 到达车站-所有类型
    checkedArriveStations: {}, // 被转中的到达车站
    departTimeStart: 0, // 出发站开始时间
    departTimeEnd: 24, // 出发站结束时间
    arriveTimeStart: 0, // 终点站开始时间
    arriveTimeEnd: 24, // 终点站结束时间
    isFiltersVisible: false, // 筛选浮层是否显示
    searchParsed: false, // 控制URL解析完成后才开始发送请求
  },
  applyMiddleware(thunk)
);
