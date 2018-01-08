import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HospitalsList } from '../ManagePage';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';

const A = styled.a`float: right; color: white; padding: 0px 10px 0px 0; display: flex; flex: 1; align-items: center; justify-content: flex-end`
const Content = styled.div`width:100%; display: flex; flex: 7;`
const H3 = styled.h3`width: 100%; color: white; padding: 10px 0 10px 0; margin: 0; font-size:2em; display: flex; flex: 1; align-items: center; justify-content: center`
const SideSearch = styled.div`width: 100%; padding: 10px 0 10px 0; font-size:1em; display:flex; flex: 1; align-items: center; justify-content: center`;
const SideInner = styled.div`height: 100%; width:100%;`

class ManageSide extends Component {
    render() {
        const { pathname } = this.props.location;
        return (
            <SideInner>
                <A href="/"><span className="glyphicon glyphicon-chevron-left"></span>Home</A>
                <Link to="/manage"><H3>Management Page</H3></Link>
                <Content>
                    <Route exact path={`/manage`} component={HospitalsList} />
                    <Route path={`/manage/hospital=:id`} component={HospitalsList} />
                </Content>
            </SideInner>
        );
    }
}

export default ManageSide;