import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { HomePage, HomeSide } from "../containers/HomePage";
import { MonitorPage, MonitorSide } from "../containers/MonitorPage";
import { ManagePage, ManageSide } from "../containers/ManagePage";
import {
  MultiMonitorPage,
  MultiMonitorSide
} from "../containers/MultiMonitorPage";
import {
  Header,
  HomeSidebar,
  Carousel,
  Searchbar,
  SearchResult
} from "../components";
import styled from "styled-components";
import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Icon,
  Container
} from "semantic-ui-react";

import { Side, HomeContainer, HomeContent, Search } from "./styles";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      toggle: 0
    };
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });
  render() {
    const { visible } = this.state;

    return (
      <Router>
        <div>
          {/* <Header /> */}
          <Route exact path="/" component={Redirect} />
          <Route
            path="/(.+)"
            render={() => (
              <div>
                <Sidebar
                  as={Menu}
                  animation="push"
                  width="wide"
                  visible={visible}
                  icon="labeled"
                  vertical
                  inverted
                  style={{ top: "40px" }}
                >
                  <Route path="/home" component={HomeSide} />
                  <Route path="/monitor" component={MonitorSide} />
                  <Route path="/multi" component={MultiMonitorSide} />
                  <Route path="/manage" component={ManageSide} />
                </Sidebar>
                <Menu
                  id="toggleMenu"
                  style={{
                    position: "fixed",
                    zIndex: 1000,
                    width: "100%",
                    margin: 0,
                    top: 0,
                    borderRadius: 0
                  }}
                >
                  <Link to="/">
                    <Menu.Item header>Sensor Monitor</Menu.Item>
                  </Link>
                  <Menu.Item onClick={this.toggleVisibility}>
                    <Icon name="sidebar" />Menu
                  </Menu.Item>
                </Menu>

                <HomeContainer id="home">
                  <div style={{ height: "40px" }} />
                  <Carousel />
                  <Container>
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
                    <Route path="/home" component={HomePage} />
                    <Route path="/monitor" component={MonitorPage} />
                    <Route path="/multi" component={MultiMonitorPage} />
                    <Route path="/manage" component={ManagePage} />
                    <Route path="/about" component={temp} />
                  </Container>
                </HomeContainer>
              </div>
            )}
          />
        </div>
      </Router>
    );
  }
}
const Redirect = () => {
  window.location.replace("/home/view");
  return <div>Redirecting to HomePage</div>;
};

const temp = () => {
  return <div />;
};
export default Routes;
