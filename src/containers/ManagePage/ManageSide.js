import React from "react";
import { HospitalsList } from "../ManagePage";
import { SideInner, H3, Content } from "../../components/styles";
import { Link, Route } from "react-router-dom";

export const ManageSide = ({ match }) => {
  const { url } = match;
  return (
    <SideInner>
      <Link to="/manage">
        <H3>Management Page</H3>
      </Link>
      <Content>
        <Route path={`${url}`} component={HospitalsList} />
      </Content>
    </SideInner>
  );
};

export default ManageSide;
