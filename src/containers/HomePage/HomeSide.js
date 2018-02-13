import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Searchbar from '../../components/Searchbar';
import { Icon } from "semantic-ui-react";
import styled from 'styled-components';

const windowHeight = window.innerHeight;
const Side = styled.div`width: 100%; padding: 20px 10px 10px 10px;`;
const Brand = styled.div`
    padding: 10px 0 20px 0; 
    font-size: 1.8em;
    font-weight: bold`;
const BrandSpan = styled.span`color: white`;
const Span = styled.span`
    color: #F0F0F0;
    &:hover {
        text-decoration: none;
    }`;
const Search = styled.div`width:100%;font-size:1em;`;
const SideItemGroup = styled.ul`padding: 50px 0 0 0 ; `;
const SideItem = styled.li`
    font-size: 1.5em; 
    list-style-type:none; 
    padding: 20px 0 20px 0;
    &:hover {
        background-color: #00A4A4;
        margin: 0 -10px 0 -10px;
    }
    &:hover span {
    }`;

function Sidebar() {
    return (
        <Side>
            <Brand><a href="/"><BrandSpan>Cloud Sensor Monitor</BrandSpan></a></Brand>
            <Search><Searchbar url={`/home`} /></Search>
            <SideItemGroup>
            <Link to="/home/view"><SideItem><Span><Icon name="home" /> Home</Span></SideItem></Link>
            <Link to="/monitor"><SideItem><Span><Icon name="computer" /> Monitor</Span></SideItem></Link>
            <Link to="/multi"><SideItem><Span><Icon name="computer" /> Multi Monitor</Span></SideItem></Link>
            <Link to="/manage"><SideItem><Span><Icon name="settings" /> Management</Span></SideItem></Link>
            <Link to="/about"><SideItem><Span><Icon name="help circle outline" /> About</Span></SideItem></Link>
            </SideItemGroup>
        </Side>
    )
}
export default Sidebar
