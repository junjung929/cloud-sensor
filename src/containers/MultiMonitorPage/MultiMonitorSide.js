import React from "react";
import { SideInner, H3, Content } from "../../components/styles";
import { Link /* Route */ } from "react-router-dom";

const MultiMonitorSide = ({ match }) => {
  // const { url } = match;

  return (
    <SideInner>
      <Link to="/multi">
        <H3>Multi Monitor Page</H3>
      </Link>
      <Content>
        {/* <Route exact path={`${url}`} component={temp} /> */}
        {/* <Route path={`${url}/patient=:_id`} component={Patient} /> */}
      </Content>
    </SideInner>
  );
};

export default MultiMonitorSide;
