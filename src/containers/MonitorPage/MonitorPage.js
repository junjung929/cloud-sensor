import React from "react";
import { SearchResult, Searchbar } from "../../components";
import { Monitor } from "../MonitorPage";
import { Route } from "react-router-dom";
import { Segment, Header } from "semantic-ui-react";
const MonitorPage = ({ match }) => {
  const { url } = match;
  return (
    <Segment basic textAlign="center" style={{ marginTop: "20px" }}>
      <Header as="h2">Monitoring Page</Header>
      <Searchbar url={url} />
      <Route
        exact
        path={`${url}`}
        component={() => {
          return (
            <div style={{ marginTop: "20px" }}>
              <Header as="h4">You can take care of a patient</Header>
              <Header as="h4">Please search a patient with name</Header>
            </div>
          );
        }}
      />
      <Route path={`${url}/patient=:_id`} component={Monitor} />
      <Route path={`${url}/search=`} component={SearchResult} />
      <Route path={`${url}/search=:searchByName`} component={SearchResult} />
    </Segment>
  );
};
export default MonitorPage;
