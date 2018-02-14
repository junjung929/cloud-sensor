import React, { Component } from "react";
import { HospitalsList } from "../ManagePage";
import { SideInner,  H3, Content } from ".../../components/styles";
import { Link, Route } from "react-router-dom";

class ManageSide extends Component {
  render() {
    const { pathname } = this.props.location;
    return (
      <SideInner>
        <Link to="/manage">
          <H3>Management Page</H3>
        </Link>
        <Content>
          {/* <Route exact path={`${url}`} component={temp} /> */}
          <Route exact path={`${pathname}`} component={HospitalsList} />
        </Content>
      </SideInner>
    );
  }
}

export default ManageSide;
