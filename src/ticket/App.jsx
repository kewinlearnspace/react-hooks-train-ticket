import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import URI from "urijs";
import dayjs from "dayjs";
import "./App.css";

import { h0 } from "../common/fp";
import useNav from "../common/useNav";
import Header from "../common/Header.jsx";
import Nav from "../common/Nav.jsx";
import Detail from "../common/Detail.jsx";
import Candidate from "./Candidate.jsx";
import Schedule from "./Schedule.jsx";

import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setDepartDate,
  setSearchParsed,
  prevDate,
  nextDate,
  setDepartTimeStr,
  setArriveTimeStr,
  setArriveDate,
  setDurationStr,
  setTickets,
  toggleIsScheduleVisible
} from "./actions";

function App(props) {
  const {
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arrvieStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed,
    dispatch
  } = props;

  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    const { aStation, dStation, trainNumber, date } = URI.parseQuery(
      window.location.search
    );
    dispatch(setDepartStation(dStation));
    dispatch(setArriveStation(aStation));
    dispatch(setTrainNumber(trainNumber));
    dispatch(setDepartDate(h0(dayjs(date).valueOf())));

    dispatch(setSearchParsed(true));
  }, []);

  useEffect(() => {
    document.title = trainNumber;
  }, [trainNumber]);

  useEffect(() => {
    if (!searchParsed) {
      return;
    }
    const url = new URI("/rest/ticket")
      .setSearch("date", dayjs(departDate).format("YYYY-MM-DD"))
      .setSearch("trainNumber", trainNumber)
      .toString();

    fetch(url)
      .then(res => res.json())
      .then(({ detail, candidates }) => {
        const {
          departTimeStr,
          arriveTimeStr,
          arriveDate,
          durationStr
        } = detail;

        dispatch(setDepartTimeStr(departTimeStr));
        dispatch(setArriveTimeStr(arriveTimeStr));
        dispatch(setArriveDate(arriveDate));
        dispatch(setDurationStr(durationStr));
        dispatch(setTickets(candidates));
      });
  }, [searchParsed, departDate, trainNumber]);
  // useEffect(() => {
  //   if (!searchParsed) {
  //     return
  //   }

  //   const url = new URI('/rest/ticket')
  //     .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
  //     .setSearch('trainNumber', trainNumber)
  //     .toString()

  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       const { detail, candidates } = result

  //       const { departTimeStr, arriveTimeStr, arriveDate, durationStr } = detail

  //       dispatch(setDepartTimeStr(departTimeStr))
  //       dispatch(setArriveTimeStr(arriveTimeStr))
  //       dispatch(setArriveDate(arriveDate))
  //       dispatch(setDurationStr(durationStr))
  //       dispatch(setTickets(candidates))
  //     })
  // }, [searchParsed, departDate, trainNumber])

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
    departDate,
    dispatch,
    prevDate,
    nextDate
  );

  if (!searchParsed) {
    return null;
  }
  return (
    <div className="app">
      <div className="header-wrapper">
        <Header title={trainNumber} onBack={onBack}></Header>
      </div>
      <div className="nav-wrapper">
        <Nav
          date={departDate}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          prev={prev}
          next={next}
        />
      </div>
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
