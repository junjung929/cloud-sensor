import _ from "lodash";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { HomePage, HomeSide } from "../containers/HomePage";
import { MonitorPage, MonitorSide } from "../containers/MonitorPage";
import { ManagePage, ManageSide } from "../containers/ManagePage";
import {
  MultiMonitorPage,
  MultiMonitorSide
} from "../containers/MultiMonitorPage";
import { Carousel, Searchbar } from "../components";

import { Sidebar, Menu, Icon, Container, Dropdown } from "semantic-ui-react";

import { HomeContainer, Search } from "./styles";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      toggle: 0
    };
  }
  HomeMenu = () => {
    let menuBarIcon = "sidebar";
    if (this.state.visible === true) {
      menuBarIcon = "triangle left";
    }
    return (
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
          <Icon name={menuBarIcon} />Menu
        </Menu.Item>
      </Menu>
    );
  };
  renderMenus = menus => {
    return _.map(menus, menu => {
      return (
        <Link
          key={`menu-${menu.to}`}
          to={menu.to}
          title={menu.title}
          onClick={menu.name === "home" ? this.onClickGeneral : null}
        >
          <Dropdown.Item>
            <Icon name={menu.name} />
            {menu.header}
          </Dropdown.Item>
        </Link>
      );
    });
  };
  OtherMenu = (menuBarText, menuBarCloseText) => {
    let menuBarIcon = "sidebar";
    if (this.state.visible === true) {
      menuBarIcon = "triangle left";
    }
    const menus = [
      {
        to: "/home/view",
        title: "Go Home page",
        name: "home",
        header: "Home"
      },
      {
        to: "/monitor",
        title: "Go Monitoring page",
        name: "computer",
        header: "Monitor"
      },
      {
        to: "/multi",
        title: "Go Multi Monitoring page",
        name: "users",
        header: "Multi Monitor"
      },
      {
        to: "/manage",
        title: "Go Management page",
        name: "settings",
        header: "Management"
      },
      {
        to: "/about",
        title: "Go About page",
        name: "help circle outline",
        header: "About"
      }
    ];
    return (
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
        <Link to="/" title="Go Homepage">
          <Menu.Item header>Sensor Monitor</Menu.Item>
        </Link>
        <Menu.Item
          onClick={this.toggleVisibility}
          className={this.state.visible ? "fadeIn" : ""}
        >
          <Icon name={menuBarIcon} />
          {this.state.visible ? menuBarCloseText : menuBarText}
        </Menu.Item>
        <Dropdown item text="Menus">
          <Dropdown.Menu>{this.renderMenus(menus)}</Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  };
  toggleVisibility = () => this.setState({ visible: !this.state.visible });
  onClickGeneral = () => {
    if (this.state.visible === true)
      this.setState({ visible: !this.state.visible });
  };
  render() {
    const { visible } = this.state;
    return (
      <Router>
        <div>
          <Route exact path="/" component={Redirect} />
          <Route
            path="/(.+)"
            render={({ match }) => {
              const { url } = match;
              let onClick = null;
              const homeUrlValidateRex = /^(\/home).+$/;
              const aboutUrlValidateRex = /^(\/about)$/;
              const multiUrlValidateRex = /^(\/multi)$/;
              if (
                homeUrlValidateRex.exec(url) ||
                aboutUrlValidateRex.exec(url) ||
                multiUrlValidateRex.exec(url)
              ) {
                onClick = this.onClickGeneral;
              }
              return (
                <div>
                  <Sidebar
                    id="Sidebar"
                    as={Menu}
                    animation="push"
                    width="wide"
                    visible={visible}
                    icon="labeled"
                    vertical
                    inverted
                    style={{ top: "40px" }}
                    onClick={onClick}
                  >
                    <Route path="/home" component={HomeSide} />
                    <Route path="/monitor" component={MonitorSide} />
                    <Route path="/multi" component={MultiMonitorSide} />
                    <Route path="/manage" component={ManageSide} />
                  </Sidebar>
                  <Route path="/home" component={() => this.HomeMenu()} />
                  <Route
                    path="/monitor"
                    component={() =>
                      this.OtherMenu("Patient Info", "Close Info")
                    }
                  />
                  <Route
                    path="/multi"
                    component={() => this.OtherMenu("See List", "Close List")}
                  />
                  <Route
                    path="/manage"
                    component={() => this.OtherMenu("See List", "Close List")}
                  />
                  <Route path="/about" component={() => this.HomeMenu()} />
                  <HomeContainer id="home" onClick={this.onClickGeneral}>
                    <div style={{ height: "40px" }} />
                    <Route path="/home" component={Carousel} />
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
              );
            }}
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
