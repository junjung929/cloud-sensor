<<<<<<< HEAD
import React, { Component } from 'react';
=======
import React, { Component } from 'react'
>>>>>>> 3a949bb02b3651485a713c8ba756a2caf926b0e1
import { SearchResult } from '../components'
import { Sensor } from '../containers'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`

const MonitorPage = ({ match }) => {
  const { url } = match
  return (
    <InnerContainer>
      <Route
        exact
        path={`${url}`}
        component={() => {
          return <div>Please search a patient by name</div>
        }}
      />
      <Route path={`${url}/patient=:_id`} component={Sensor} />
      <Route path={`${url}/search=:searchByName`} component={SearchResult} />
    </InnerContainer>
  )
}
export default MonitorPage
