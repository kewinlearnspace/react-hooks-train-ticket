import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import URI from 'urijs'
import './App.css'

import Header from '../common/Header.jsx'
import Detail from '../common/Detail.jsx'
import Account from './Account.jsx'
import Choose from './Choose.jsx'
import Passengers from './Passengers.jsx'
import Ticket from './Ticket.jsx'
import Menu from './Menu.jsx'

import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setSeatType,
  setDepartDate,
  setSearchParsed,
  fetchInitial,
  createAdult,
  createChild,
  removePassenger,
  updatePassenger,
  hideMenu,
  showGenderMenu,
  showFollowAdultMenu,
  showTicketTypeMenu,
} from './actions'
import dayjs from 'dayjs'
import { bindActionCreators } from 'redux'

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
    searchParsed,
    dispatch,
  } = props
  // 由于onBack没有引用到任何可变的变量,所以第二个参数为空
  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  useEffect(() => {
    const { trainNumber, dStation, aStation, type, date } = URI.parseQuery(window.location.search)

    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setSeatType(type))
    dispatch(setDepartDate(dayjs(date).valueOf()))
    dispatch(setSearchParsed(true))
  }, [])

  useEffect(() => {
    if (!searchParsed) {
      return
    }
    const url = new URI('/rest/order')
      .setSearch('dStation', departStation)
      .setSearch('aStation', arriveStation)
      .setSearch('type', seatType)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .toString()
    // actions中发送请求
    dispatch(fetchInitial(url))
  }, [searchParsed, departStation, arriveStation, seatType, departDate])

  const passengersCbs = useMemo(() => {
    return bindActionCreators(
      {
        createAdult,
        createChild,
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
      },
      dispatch
    )
  }, [])
  
  const menuCbs = useMemo(() => {
    return bindActionCreators({ hideMenu }, dispatch)
  }, [])

  const chooseCbs = useMemo(() => {
    return bindActionCreators({ updatePassenger }, dispatch)
  }, [])

  if (!searchParsed) {
    return null
  }
  return (
    <div className="app">
      <div className="header-wrapper">
        <Header title="订单填写" onBack={onBack}></Header>
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
          <span style={{ display: 'block' }} className="train-icon"></span>
        </Detail>
      </div>
      <Ticket price={price} type={seatType}></Ticket>
      <Passengers passengers={passengers} {...passengersCbs}></Passengers>
      {passengers.length > 0 && <Choose passengers={passengers} {...chooseCbs}></Choose>}
      <Menu show={isMenuVisible} {...menu} {...menuCbs}></Menu>
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  }
)(App)
