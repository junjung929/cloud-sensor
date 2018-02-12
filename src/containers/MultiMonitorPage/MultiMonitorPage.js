import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { Sidebar, Carousel, Searchbar, SearchResult } from "../../components";
import { MultiMonitor } from "../MultiMonitorPage";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;

const MultiMonitorPage = ({ match }) => {
  const { url } = match;
  return (
    <InnerContainer>
      <Route
        exact
        path={`${url}`}
        component={() => {
          return <MultiMonitor />;
        }}
      />
      <Route path={`${url}/search=:searchByName`} component={SearchResult} />
    </InnerContainer>
  );
};
export default MultiMonitorPage;
