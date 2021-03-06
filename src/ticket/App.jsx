import React, { useCallback, useEffect, useMemo, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import URI from 'urijs';
import dayjs from 'dayjs';
import './App.css';

import { h0 } from '../common/fp';
import useNav from '../common/useNav';
import Header from '../common/Header.jsx';
import Nav from '../common/Nav.jsx';
import Detail from '../common/Detail.jsx';
import Candidate from './Candidate.jsx';
// import Schedule from './Schedule.jsx'
import { TrainContext } from './context';

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
  toggleIsScheduleVisible,
} from './actions';
// 异步加载组件
const Schedule = lazy(() => import('./Schedule.jsx'));

function App(props) {
  const {
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed,
    dispatch,
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
    const url = new URI('/rest/ticket')
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('trainNumber', trainNumber)
      .toString();

    fetch(url)
      .then(res => res.json())
      .then(({ detail, candidates }) => {
        const {
          departTimeStr,
          arriveTimeStr,
          arriveDate,
          durationStr,
        } = detail;

        dispatch(setDepartTimeStr(departTimeStr));
        dispatch(setArriveTimeStr(arriveTimeStr));
        dispatch(setArriveDate(arriveDate));
        dispatch(setDurationStr(durationStr));
        dispatch(setTickets(candidates));
      });
  }, [searchParsed, departDate, trainNumber]);

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
    departDate,
    dispatch,
    prevDate,
    nextDate
  );

  // toggleIsScheduleVisible绑定到一起
  const detailCbs = useMemo(() => {
    return bindActionCreators(
      {
        toggleIsScheduleVisible,
      },
      dispatch
    );
  }, []);

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
      <div className="detail-wrapper">
        <Detail
          departDate={departDate}
          arriveDate={arriveDate}
          departTimeStr={departTimeStr}
          arriveTimeStr={arriveTimeStr}
          trainNumber={trainNumber}
          departStation={departStation}
          arriveStation={arriveStation}
          durationStr={durationStr}
        >
          <span className="left"></span>
          <span
            className="schedule"
            onClick={() => detailCbs.toggleIsScheduleVisible()}
          >
            时刻表
          </span>
          <span className="right"></span>
        </Detail>
      </div>
      <div className="candidate-wrapper">
        <TrainContext.Provider
          value={{ trainNumber, departStation, arriveStation, departDate }}
        >
          <Candidate tickets={tickets}></Candidate>
        </TrainContext.Provider>
      </div>
      {isScheduleVisible && (
        <div
          className="mask"
          onClick={() => dispatch(toggleIsScheduleVisible())}
        >
          {/* 异步组件 */}
          <Suspense fallback={<div>loading</div>}>
            <Schedule
              date={departDate}
              trainNumber={trainNumber}
              departStation={departStation}
              arriveStation={arriveStation}
            ></Schedule>
          </Suspense>
        </div>
      )}
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
