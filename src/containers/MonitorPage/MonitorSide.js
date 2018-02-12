import React from 'react';
import { Searchbar } from '../../components'
import { SideInner, A, H3, SideSearch, Content } from "./styles";
import { Link, Route } from "react-router-dom";
import { Patient } from "../HomePage";


const MonitorSide = ({ match }) => {
  const { url } = match;

  return (
    <SideInner>
      <A href="/">
        <span className="glyphicon glyphicon-chevron-left" />Home
      </A>
      <Link to="/monitor">
        <H3>Monitor Page</H3>
      </Link>
      <SideSearch>
        <Searchbar url={url} />
      </SideSearch>
      <Content>
        {/* <Route exact path={`${url}`} component={temp} /> */}
        <Route path={`${url}/patient=:_id`} component={Patient} />
      </Content>
    </SideInner>
  );
};

export default MonitorSide;
