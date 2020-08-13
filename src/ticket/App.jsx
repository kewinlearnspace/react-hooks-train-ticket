import React from 'react'
import { connect } from 'react-redux'
import './App.css'

import Header from '../common/Header.jsx'
import Detail from '../common/Detail.jsx'
import Candidate from './Candidate.jsx'
import Schedule from './Schedule.jsx'

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
    dispatch,
  } = props
  return <div className="a">{/* <Header></Header> */}</div>
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  }
)(App)
