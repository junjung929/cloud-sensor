import React, { Component } from 'react';
import { Hospitals, Hospital } from '../ManagePage';
import { Sensor } from 'containers'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'

const InnerContainer = styled.div`display: flex; justify-content: center; width:100%; flex-direction: column`;

const ManagePage = ({ match }) => {
    const { url } = match;
    return (
        <InnerContainer>
            <Route exact path={`${url}`} component={Hospitals} />
            <Route exact path={`${url}/hospital=:id`} component={Hospital} />
        </InnerContainer>
    )
}
export default ManagePage;