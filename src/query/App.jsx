import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import './App.css'

import Nav from '../common/Nav.jsx'
import Bottom from './Bottom.jsx'
import List from './List.jsx'
import Header from '../common/Header.jsx'

function App(props) {
  const onBack = useCallback(() => {
    window.history.back()
  }, [])
  return (
    <div>
      <Header title="查询火车票" onBack={onBack}></Header>
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    // 获取所有的数据
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  }
)(App)
