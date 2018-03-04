import React from "react";
import {
  Hospitals,
  Hospital,
  Floor,
  Room,
  Patients,
  Sensors
} from "../ManagePage";
import { Route, Redirect, Switch } from "react-router-dom";
import { Tab } from "semantic-ui-react";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 40px;
  flex-direction: column;
`;

const ManagePage = ({ match }) => {
  const { url } = match;
  const panes = [
    {
      menuItem: { key: "hospitals", icon: "hospital", content: "Hospitals" },
      render: () => (
        <Tab.Pane>
          <Switch>
            <Route exact path={`${url}`} component={Hospitals} />
            <Route
              exact
              path={`${url}/hospital=:hospital_id`}
              component={Hospital}
            />
            <Route
              exact
              path={`${url}/hospital=:hospital_id/floor=:floor_id`}
              component={Floor}
            />
            <Route
              exact
              path={`${url}/hospital=:hospital_id/floor=:floor_id/room=:room_id`}
              component={Room}
            />
            <Redirect to={`${url}`} />
          </Switch>
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: "pateints", icon: "hospital", content: "Patients" },
      render: () => (
        <Tab.Pane>
          <Switch>
            <Route path={`${url}/patients`} component={Patients} />
            <Redirect to={`${url}/patients`} />
          </Switch>
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: "sensors", icon: "hospital", content: "Sensors" },
      render: () => (
        <Tab.Pane>
          <Switch>
            <Route path={`${url}/sensors`} component={Sensors} />
            <Redirect to={`${url}/sensors`} />
          </Switch>
        </Tab.Pane>
      )
    }
  ];
  return (
    <InnerContainer>
      <Tab panes={panes} />
    </InnerContainer>
  );
};
export default ManagePage;
