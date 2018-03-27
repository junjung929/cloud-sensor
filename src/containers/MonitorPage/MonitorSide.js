import React from "react";
import { Searchbar } from "../../components";
import { SideInner, H3, SideSearch, Content } from "../../components/styles";
import { Link, Route } from "react-router-dom";
import { Patient } from "../MonitorPage";

const MonitorSide = ({ match }) => {
  const { url } = match;

  return (
    <SideInner>
      <Link to="/monitor">
        <H3>Monitor Page</H3>
      </Link>
      <SideSearch>
        <Searchbar url={url} />
      </SideSearch>
      <Content>
        <Route
          exact
          path={`${url}`}
          component={() => {
            return (
              <div className="text-center" style={{ color: "white" }}>
                <h4>You can take care of a patient</h4>
                <h4>Please search a patient with name</h4>
              </div>
            );
          }}
        />
        <Route path={`${url}/patient=:_id`} component={Patient} />
      </Content>
    </SideInner>
  );
};

export default MonitorSide;
