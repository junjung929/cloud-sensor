import React from 'react'
import { HomePage, MonitorPage, ManagePage } from 'containers'
import { Header, Sidebar, Carousel, Searchbar, SearchResult } from 'components'
import { Patient } from 'containers/HomePage'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import MultiMonitorPage from '../containers/MultiMonitorPage';
import ManageSide from '../containers/ManagePage/ManageSide';

const Container = styled.div`text-align: center;`
const windowHeight = window.innerHeight;
const Side = styled.div`
    float: left; 
    min-height:${windowHeight}px; 
    width: 25%; 
    position: fixed; 
    background-color: #333F50; 
    color: white;
    box-shadow: 3px 0px 8px 3px rgba(0, 0, 0, 0.3);
    display: flex; 
    align-items: center; 
    flex-direction: column; 
    justify-content: center`;

const Search = styled.div`padding: 20px 0 20px 0`
const HomeContainer = styled.div`float:right; width:75%;`;
const HomeContent = styled.div`padding: 0 0 20px 0`
const InnerContainer = styled.div`display: flex; justify-content: center; width:100%; flex-direction: column`;

function Routes() {

    return (
        <Router>
            <Container>
                {/* <Header /> */}
                <Route exact path="/" component={Redirect} />
                <Route path="/(.+)" render={(() =>
                    <div>
                        <Side>
                            <Route path="/home" component={Sidebar} />
                            <Route path="/monitor" component={MonitorSide} />
                            <Route path="/multi" component={MultiMonitorSide} />
                            <Route path="/manage" component={ManageSide} />
                        </Side>
                        <HomeContainer id="home">
                            <HomeContent>
                                <Carousel />
                                <Search>
                                    <Route path="/home" component={() => { return (<Searchbar url={`/home`} />) }} />
                                    <Route path="/monitor" component={() => { return (<Searchbar url={`/monitor`} />) }} />
                                    <Route path="/multi" component={() => { return (<Searchbar url={`/multi`} />) }} />
                                </Search>
                                {/* <Hospitals /> */}
                                <Route path="/home" component={HomePage} />
                                <Route path="/monitor" component={MonitorPage} />
                                <Route path="/multi" component={MultiMonitor} />
                                <Route path="/manage" component={ManagePage} />
                                <Route path="/about" component={temp} />
                            </HomeContent>
                        </HomeContainer>
                    </div>
                )} />

            </Container>
        </Router>
    )
}
const Redirect = () => {
    window.location.replace("/home/view");
    return (<div>Redirecting to HomePage</div>);
}


const MonitorSide = ({ match }) => {
    const { url } = match;
    const A = styled.a` float: right; color: white; padding: 0px 10px 0px 0; display: flex; flex: 1; align-items: center; justify-content: flex-end`
    const Content = styled.div`width:100%; display: flex; flex: 7; justify-content: center;`
    const H3 = styled.h3`width: 100%; color: white; padding: 10px 0 10px 0; margin: 0; font-size:2em; display: flex; flex: 1; align-items: center; justify-content: center`
    const SideSearch = styled.div`width: 100%; padding: 10px 0 10px 0; font-size:1em; display:flex; flex: 1; align-items: center; justify-content: center`;
    const SideInner = styled.div`height: 100%; width:100%;`
    return (
        <SideInner>
            <A href="/"><span className="glyphicon glyphicon-chevron-left"></span>Home</A>
            <Link to="/monitor"><H3>Monitor Page</H3></Link>
            <SideSearch><Searchbar url={url} /></SideSearch>
            <Content>
                <Route exact path={`${url}`} component={temp} />
                <Route path={`${url}/patient=:_id`} component={Patient} />
            </Content>
        </SideInner>
    )
}
const MultiMonitor = ({ match }) => {
    const { url } = match;
    return (
        <InnerContainer>
            <Route exact path={`${url}`} component={() => { return <MultiMonitorPage />}} />
            <Route path={`${url}/search=:searchByName`} component={SearchResult} />
        </InnerContainer>
    )
}
const MultiMonitorSide = ({ match }) => {
    const { url } = match;
    const A = styled.a` float: right; color: white; padding: 0px 10px 0px 0; display: flex; flex: 1; align-items: center; justify-content: flex-end`
    const Content = styled.div`width:100%; display: flex; flex: 7; justify-content: center;`
    const H3 = styled.h3`width: 100%; color: white; padding: 10px 0 10px 0; margin: 0; font-size:2em; display: flex; flex: 1; align-items: center; justify-content: center`
    const SideSearch = styled.div`width: 100%; padding: 10px 0 10px 0; font-size:1em; display:flex; flex: 1; align-items: center; justify-content: center`;
    const SideInner = styled.div`height: 100%; width:100%;`
    return (
        <SideInner>
            <A href="/"><span className="glyphicon glyphicon-chevron-left"></span>Home</A>
            <Link to="/monitor"><H3>Monitor Page</H3></Link>
            <Content>
                <Route exact path={`${url}`} component={temp} />
                {/* <Route path={`${url}`} component={} /> */}
            </Content>
        </SideInner>
    )
}
const temp = () => {
    return (<div>
    </div>)
}
export default Routes
