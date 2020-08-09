import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import './App.css'

import Header from '../common/Header.jsx'
import DepartDate from './DepartDate.jsx'
import HighSpeed from './HighSpeed.jsx'
import Journey from './Journey.jsx'
import Submit from './Submit.jsx'

function App(props) {
  // 由于onBack没有引用到任何可变的变量,所以第二个参数为空
  const onBack = useCallback(() => {
    window.history.back()
  }, [])
  return (
    <div>
      <div className="header-wapper">
        <Header title="火车票" onBack={onBack}></Header>
      </div>
      <DepartDate></DepartDate>
      <HighSpeed></HighSpeed>
      <Journey></Journey>
      <Submit></Submit>
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
