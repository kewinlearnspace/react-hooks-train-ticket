import { createStore, combineReducers, applyMiddleware } from "redux";

import reducers from "./reducers";
import thunk from "redux-thunk";

export default createStore(
  combineReducers(reducers),
  {
    trainNumber: null, // 车次编号
    departStation: null, // 出发车站
    arriveStation: null, // 到达车站
    seatType: null, // 坐席类型
    departDate: Date.now(), // 出发日期
    arriveDate: Date.now(), // 到达日期
    departTimeStr: null, // 出发时间
    arriveTimeStr: null, // 到达时间
    durationStr: null, // 行程时间
    price: null, // 票价
    passengers: [], // 乘客信息
    menu: null, // 弹出菜单
    isMenuVisible: false, // 菜单是否可见
    searchParsed: false // url参数是否解析完成
  },
  applyMiddleware(thunk)
);
