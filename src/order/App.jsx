import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import './App.css'

import Header from '../common/Header.jsx'
function App(props) {
  // 由于onBack没有引用到任何可变的变量,所以第二个参数为空
  const onBack = useCallback(() => {
    window.history.back()
  }, [])
  return (
    <div>
      <Header title="火车票" onBack={onBack}></Header>
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {},
  function mapDispatchToProps(dispatch) {}
)(App)
