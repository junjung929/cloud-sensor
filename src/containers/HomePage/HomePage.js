import React, { Component } from 'react';
import { Sidebar, Carousel, Searchbar, SearchResult } from '../../components'
import { Hospitals, Hospital, Floor, Room } from 'containers/HomePage'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`

const HomePage = ({ match }) => {
  const { url } = match
  return (
    <InnerContainer>
      <Route path={`${url}/view`} component={Hospitals} />
      <Route path={`${url}/view/hospital=:_id`} component={Hospital} />
      <Route path={`${url}/view/hospital=:_id/floor=:floor`} component={Floor} />
      <Route path={`${url}/view/hospital=:_id/floor=:floor/room=:room`} component={Room} />
      <Route path={`${url}/search=:searchByName`} component={SearchResult} />
    </InnerContainer>
  )
}
export default HomePage
