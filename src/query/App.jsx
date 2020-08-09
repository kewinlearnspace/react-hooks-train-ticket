import React from 'react'
import { connect } from 'react-redux'
import './App.css'

import Header from '../common/Header.jsx'

function App(props) {
  return (
    <div>
      <Header></Header>
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {},
  function mapDispatchToProps(dispatch) {}
)(App)
