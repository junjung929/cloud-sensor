import React from "react";
import { Route } from "react-router-dom";
import { MultiMonitor } from "../MultiMonitorPage";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 40px;
  flex-direction: column;
`;

const MultiMonitorPage = ({ match }) => {
  const { url } = match;
  return (
    <InnerContainer>
      <Route path={`${url}`} component={MultiMonitor} />
    </InnerContainer>
  );
};
export default MultiMonitorPage;
