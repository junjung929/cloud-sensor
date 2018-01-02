import React from 'react'
import { /* CounterContainer, */ HomePage, MonitorPage } from 'containers'
import { Header, Hospital } from 'components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`text-align: center;`

function Routes() {
  return (
    <Router>
      <Container>
        {/* <Header /> */}
        <Route exact path="/" component={Redirect} />
        <Route path="/home" component={HomePage} />
        <Route path="/monitor" component={MonitorPage} />
      </Container>
    </Router>
  )
}
const Redirect = () => {
  window.location.replace("/home");
  return (<div>Redirecting to HomePage</div>);
}
export default Routes
