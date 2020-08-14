import React, { useCallback } from "react";
import { connect } from "react-redux";
import "./App.css";

import Header from "../common/Header.jsx";
import Account from "./Account.jsx";
import Choose from "./Choose.jsx";
import Passengers from "./Passengers.jsx";
import Ticket from "./Ticket.jsx";
function App(props) {
  const {
    trainNumber,
    departStation,
    arriveStation,
    seatType,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    durationStr,
    price,
    passengers,
    menu,
    isMenuVisible,
    searchType,
    dispatch
  } = props;
  // 由于onBack没有引用到任何可变的变量,所以第二个参数为空
  const onBack = useCallback(() => {
    window.history.back();
  }, []);
  return (
    <div className="app">
      <div className="header-wrapper"></div>
      <Header title="火车票" onBack={onBack}></Header>
    </div>
  );
}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(App);
