import React, { useCallback, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import URI from "urijs";
import dayjs from "dayjs";

import "./App.css";

import useNav from "../common/useNav.js";
import Nav from "../common/Nav.jsx";
import Bottom from "./Bottom.jsx";
import List from "./List.jsx";
import Header from "../common/Header.jsx";

import {
  setFrom,
  setTo,
  setDepartDate,
  setHighSpeed,
  setSearchParsed,
  setTrainList,
  setTicketTypes,
  setTrainTypes,
  setDepartStations,
  setArriveStations,
  prevDate,
  nextDate,
  toggleOrderType,
  toggleHighSpeed,
  toggleOnlyTickets,
  toggleIsFiltersVisible
} from "./actions";

import { h0 } from "../common/fp";
import { bindActionCreators } from "redux";

function App(props) {
  const {
    from,
    to,
    departDate,
    highSpeed,
    dispatch,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    searchParsed, // 控制URL解析完成后才开始发送请求
    trainList,
    isFiltersVisible
  } = props;
  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  // 操作了组件上下文之外的东西也属于副作用的一种
  // useEffect第二个参数一定要明确是否书写
  useEffect(() => {
    // 解析url
    const { from, to, date, highSpeed } = URI.parseQuery(
      window.location.search
    );
    dispatch(setFrom(from));
    dispatch(setTo(to));
    dispatch(setDepartDate(h0(dayjs(date).valueOf())));
    dispatch(setHighSpeed(highSpeed === "true"));
    // url参数解析完后
    dispatch(setSearchParsed(true));
  }, []);

  // 一般来说作为发起请求的参数,那么这些参数就是该useEffect的依赖
  useEffect(() => {
    if (!searchParsed) {
      return;
    }
    const url = new URI("/rest/query")
      .setSearch("from", from)
      .setSearch("to", to)
      .setSearch("date", dayjs(departDate).format("YYYY-MM-DD"))
      .setSearch("highSpeed", highSpeed)
      .setSearch("orderType", orderType)
      .setSearch("onlyTickets", onlyTickets)
      .setSearch("checkedTicketTypes", Object.keys(checkedTicketTypes).join())
      .setSearch("checkedTrainTypes", Object.keys(checkedTrainTypes).join())
      .setSearch(
        "checkedDepartStations",
        Object.keys(checkedDepartStations).join()
      )
      .setSearch(
        "checkedArriveStations",
        Object.keys(checkedArriveStations).join()
      )
      .setSearch("departTimeStart", departTimeStart)
      .setSearch("departTimeEnd", departTimeEnd)
      .setSearch("arriveTimeStart", arriveTimeStart)
      .setSearch("arriveTimeEnd", arriveTimeEnd)
      .toString();
    fetch(url)
      .then(res => res.json())
      .then(res => {
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: { ticketType, trainType, depStation, arrStation }
            }
          }
        } = res;
        dispatch(setTrainList(trains));
        dispatch(setTicketTypes(ticketType));
        dispatch(setTrainTypes(trainType));
        dispatch(setDepartStations(depStation));
        dispatch(setArriveStations(arrStation));
      });
  }, [
    from,
    to,
    departDate,
    highSpeed,
    searchParsed,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd
  ]);

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
    departDate,
    dispatch,
    prevDate,
    nextDate
  );

  const bottomCbs = useMemo(() => {
    return bindActionCreators(
      {
        toggleOrderType,
        toggleHighSpeed,
        toggleOnlyTickets,
        toggleIsFiltersVisible
      },
      dispatch
    );
  }, []);

  if (!searchParsed) {
    return null;
  }
  return (
    <div>
      <div className="header-wrapper">
        <Header title={`${from} -> ${to}`} onBack={onBack}></Header>
      </div>
      <Nav
        date={departDate}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        prev={prev}
        next={next}
      ></Nav>
      <List list={trainList}></List>
      <Bottom
        highSpeed={highSpeed}
        orderType={orderType}
        onlyTickets={onlyTickets}
        isFiltersVisible={isFiltersVisible}
        {...bottomCbs}
      ></Bottom>
    </div>
  );
}

export default connect(
  function mapStateToProps(state) {
    // 获取所有的数据
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(App);
