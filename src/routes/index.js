import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { HomePage } from "../containers/HomePage";
import { MonitorPage, MonitorSide } from '../containers/MonitorPage';
import { ManagePage, ManageSide } from '../containers/ManagePage';
import { MultiMonitorPage, MultiMonitorSide } from '../containers/MultiMonitorPage';
import {
  Header,
  Sidebar,
  Carousel,
  Searchbar,
  SearchResult
} from "../components";
import styled from "styled-components";

import { Container, Side, HomeContainer, HomeContent, Search } from "./styles";

function Routes() {
  return (
    <Router>
      <Container>
        {/* <Header /> */}
        <Route exact path="/" component={Redirect} />
        <Route
          path="/(.+)"
          render={() => (
            <div>
              <Side>
                <Route path="/home" component={Sidebar} />
                <Route path="/monitor" component={MonitorSide} />
                <Route path="/multi" component={MultiMonitorSide} />
                <Route path="/manage" component={ManageSide} />
              </Side>
              <HomeContainer id="home">
                <HomeContent>
                  <Carousel />
                  <Search>
                    <Route
                      path="/home"
                      component={() => {
                        return <Searchbar url={`/home`} />;
                      }}
                    />
                    <Route
                      path="/monitor"
                      component={() => {
                        return <Searchbar url={`/monitor`} />;
                      }}
                    />
                    
                  </Search>
                  {/* <Hospitals /> */}
                  <Route path="/home" component={HomePage} />
                  <Route path="/monitor" component={MonitorPage} />
                  <Route path="/multi" component={MultiMonitorPage} />
                  <Route path="/manage" component={ManagePage} />
                  <Route path="/about" component={temp} />
                </HomeContent>
              </HomeContainer>
            </div>
          )}
        />
      </Container>
    </Router>
  );
}
const Redirect = () => {
  window.location.replace("/home/view");
  return <div>Redirecting to HomePage</div>;
};


const temp = () => {
  return <div />;
};
export default Routes;
