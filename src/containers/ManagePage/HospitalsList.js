import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchHospitals, fetchHospital, fetchFloor } from 'actions';
import { Link } from 'react-router-dom';

import styled from 'styled-components';


const ListGroup = styled.ul`padding-left:2vw;`;
const ListGroupItem = styled.li`
    list-style-type: none;`;
class HospitalsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            floorsList: null,
            roomsList: null,
            bedsList: null
        }
    }
    componentDidMount() {
        const { hospitals, fetchHospitals } = this.props;
        if(!hospitals){
            fetchHospitals();
        }
    }
    onFloorClick(id) {
        const { floor, fetchFloor } = this.props;
        fetchFloor(id);
        this.setState({ roomsList: this.renderRoomsList() });
    }
    onHospitalClick(id) {
        const { hospital, fetchHospital } = this.props;
        fetchHospital(id);
        this.setState({ floorsList: this.renderFloorsList() });
    }
    renderFloorsList() {
        const { hospital } = this.props;
        const { url } = this.props.match;
        if(!hospital){return <div />}
        return _.map(hospital._floor_list, floor => {
            const { _id, number, hospital_ } = floor; 
            console.log(number)
            return (
                <ListGroupItem key={_id}><Link to={`${url}/floor=${_id}`}> - {number} floor</Link>
                    
                </ListGroupItem>
            )
        }) 
    }
    renderHospitalsList() {
        const { hospitals } = this.props;
        const { url } = this.props.match;
        console.log(url);
        const { id } = this.props.match.params;
        let items = <div />;
        return _.map(hospitals, hospital => {
            const { _id, name } = hospital
            if(id === _id){
                items = this.renderFloorsList();
            }
            else {
                items = <div />;
            }
            return (
                <ListGroup key={_id} >
                    <Link style={{textDecoration:'none', color:'white'}} to={`/manage/hospital=${_id}`} onClick={() => {this.onHospitalClick(_id)}}> - {name}</Link>
                        {items}
                </ListGroup>
            );
        }); 

    }
    render() {
        return(
            <ListGroup>{this.renderHospitalsList()}</ListGroup>
        );
    }
}

function mapStateToProps(state) {
    return { hospitals: state.hospitals.hospitals, hospital: state.hospitals.hospital, floor: state.hospitals.floor };
}

export default connect(mapStateToProps, { fetchHospitals, fetchHospital, fetchFloor })(HospitalsList);