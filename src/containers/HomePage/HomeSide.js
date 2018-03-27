import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import Searchbar from "../../components/Searchbar";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { SideInner } from ".../../components/styles";

const Brand = styled.div`
  padding: 10px 0 20px 0;
  font-size: 1.8em;
  font-weight: bold;
`;
const BrandSpan = styled.span`
  color: white;
`;
const Span = styled.span`
  color: #f0f0f0;
  &:hover {
    text-decoration: none;
  }
`;
const Search = styled.div`
  width: 100%;
  font-size: 1em;
`;
const SideItemGroup = styled.ul`
  padding: 50px 0 0 0;
`;
const SideItem = styled.li`
  font-size: 1.5em;
  list-style-type: none;
  padding: 20px 0 20px 0;
  &:hover {
    background-color: #00a4a4;
    margin: 0 -10px 0 -10px;
  }
  &:hover span {
  }
`; /* 
const sidebarInvisible = () => {
  const sidebar = document.getElementById("Sidebar");
  sidebar.classList.remove("visible");
}; */
const SideItemGroupRender = items => {
  return _.map(items, item => {
    return (
      <Link key={`home-side-${item.name}`} to={item.to}>
        <SideItem>
          <Span>
            <Icon name={item.name} /> {item.text}
          </Span>
        </SideItem>
      </Link>
    );
  });
};
const HomeSide = () => {
  const menus = [
    {
      to: "/home/view",
      name: "home",
      text: "Home"
    },
    {
      to: "/monitor",
      name: "computer",
      text: "Monitor"
    },
    {
      to: "/multi",
      name: "users",
      text: "Multi Monitor"
    },
    {
      to: "/manage",
      name: "settings",
      text: "Management"
    },
    {
      to: "/about",
      name: "help circle outline",
      text: "About"
    }
  ];
  return (
    <SideInner>
      <Brand>
        <a href="/">
          <BrandSpan>Cloud Sensor Monitor</BrandSpan>
        </a>
      </Brand>
      <Search>
        <Searchbar url={`/home`} />
      </Search>
      <SideItemGroup>{SideItemGroupRender(menus)}</SideItemGroup>
    </SideInner>
  );
};
export default HomeSide;
