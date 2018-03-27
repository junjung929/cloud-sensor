import React from "react";
import { SearchResult } from "../../components";
import { Hospitals, Hospital, Floor, Room } from "../../containers/HomePage";
import { Route } from "react-router-dom";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;

const HomePage = ({ match }) => {
  const { url } = match;
  return (
    <InnerContainer>
      <Route path={`${url}/view`} component={Hospitals} />
      <Route path={`${url}/view/hospital=:hospital_id`} component={Hospital} />
      <Route
        path={`${url}/view/hospital=:hospital_id/floor=:floor_id`}
        component={Floor}
      />
      <Route
        path={`${url}/view/hospital=:hospital_id/floor=:floor_id/room=:room_id`}
        component={Room}
      />
      <Route path={`${url}/search=`} component={SearchResult} />
      <Route path={`${url}/search=:searchByName`} component={SearchResult} />
    </InnerContainer>
  );
};
export default HomePage;
