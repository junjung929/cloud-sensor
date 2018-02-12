import React from "react";
import { Link } from "react-router-dom";
import { SideInner, A, H3, Content } from "./styles";
const MultiMonitorSide = ({ match }) => {
  const { url } = match;
  return (
    <SideInner>
      <A href="/">
        <span className="glyphicon glyphicon-chevron-left" />Home
      </A>
      <Link to="/monitor">
        <H3>Monitor Page</H3>
      </Link>
      <Content>
        {/* <Route exact path={`${url}`} component={temp} /> */}
        {/* <Route path={`${url}`} component={} /> */}
      </Content>
    </SideInner>
  );
};

export default MultiMonitorSide;
