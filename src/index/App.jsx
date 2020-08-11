import React, { useCallback, useMemo } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./App.css";

import Header from "../common/Header.jsx";
import DepartDate from "./DepartDate.jsx";
import HighSpeed from "./HighSpeed.jsx";
import Journey from "./Journey.jsx";
import Submit from "./Submit.jsx";

import CitySelector from "../common/CitySelector.jsx";

// actions返回的是对象。需要将其传入到dispatch中
import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector
} from "./actions";

function App(props) {
  const {
    from,
    to,
    dispatch,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData,
    departDate
  } = props;
  // 由于onBack没有引用到任何可变的变量,所以第二个参数为空
  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  // 依赖于dispatch exchangeFromTo => 但是这三个值都不会变,所以传空数组
  // const doExchangeFromTo = useCallback(() => {
  //   dispatch(exchangeFromTo())
  // }, [])

  // const doShowCitySelector = useCallback(() => {
  //   dispatch(showCitySelector())
  // }, [])

  const cbs = useMemo(() => {
    return bindActionCreators(
      {
        exchangeFromTo,
        showCitySelector
      },
      dispatch
    );
  }, []);

  const citySlectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideCitySelector, // onBack执行hideCitySelector()
        fetchCityData,
        onSelect: setSelectedCity
      },
      dispatch
    );
  }, []);

  const departDateCbs = useMemo(() => {
    return bindActionCreators(
      {
        onClick: showDateSelector
      },
      dispatch
    );
  }, []);
  return (
    <div>
      <div className="header-wapper">
        <Header title="火车票" onBack={onBack}></Header>
      </div>
      <form className="form">
        {/* <Journey
        from={from}
        to={to}
        exchangeFromTo={doExchangeFromTo}
        showCitySelector={doShowCitySelector}
      ></Journey> */}
        <Journey from={from} to={to} {...cbs}></Journey>
        <DepartDate time={departDate} {...departDateCbs}></DepartDate>
        <HighSpeed></HighSpeed>
        <Submit></Submit>
      </form>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySlectorCbs}
      ></CitySelector>
    </div>
  );
}

// connect将数据返回到当前组件的props中
export default connect(
  function mapStateToProps(state) {
    // 获取所有的数据
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(App);
