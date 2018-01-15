import React, { Component } from 'react';
import { SearchResult } from 'components'
import { Sensor } from 'containers'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'

const InnerContainer = styled.div`display: flex; justify-content: center; width:100%; flex-direction: column`;

const MonitorPage = ({ match }) => {
    const { url } = match;
    return (
        <InnerContainer>
            <Route exact path={`${url}`} component={() => { return (<div>Please search a patient by name</div>) }} />
            <Route path={`${url}/patient=:_id`} component={Sensor} />
            <Route path={`${url}/search=:searchByName`} component={SearchResult} />
        </InnerContainer>
    )
}
export default MonitorPage;