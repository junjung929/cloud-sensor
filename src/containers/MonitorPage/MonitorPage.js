import React from "react";
import { SearchResult } from "../../components";
import { Monitor } from "../MonitorPage";
import { Route } from "react-router-dom";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;

const MonitorPage = ({ match }) => {
  const { url } = match;
  return (
    <InnerContainer>
      <Route
        exact
        path={`${url}`}
        component={() => {
          return (
            <div className="text-center">
              <h2>Monitor Page</h2>
              <h4>You can take care of a patient</h4>
              <h4>Please search a patient with name</h4>
            </div>
          );
        }}
      />
      <Route path={`${url}/patient=:_id`} component={Monitor} />
      <Route path={`${url}/search=`} component={SearchResult} />
      <Route path={`${url}/search=:searchByName`} component={SearchResult} />
    </InnerContainer>
  );
};
export default MonitorPage;
