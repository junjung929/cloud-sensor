import _ from 'lodash'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'react-loading-indicator';
import { fetchRoomsAt, fetchFloor } from '../../actions';
import styled from 'styled-components'

//components
import { Table, BackToList } from '../../components';

const Content = styled.div`
    display: flex;
    justify-content: center;`;

class FloorPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            floor: null
        }
    }
    componentDidMount() {
        console.log("Floor page mounted");
        const { floor } = this.props.match.params;
        this.props.fetchRoomsAt(floor);
        this.props.fetchFloor(floor);
        this.setState({ floor });
    }
    componentDidUpdate() {
        const { floor } = this.props.match.params;
        if (floor != this.state.floor) {
            this.props.fetchRoomsAt(floor);
            this.props.fetchFloor(floor);
            this.setState({ floor });
        }
    }
    getFreeRooms(room) {
        // map room bed list _patient
        // if _patient is undefined count up
        // return the count 
        let cnt = 0;
        let freeRooms =  _.map(room._bed_list, bed => {
            if(!bed._patient){
                return ++cnt;
            }
        });
        freeRooms = freeRooms[room._bed_list.length-1];
        if(!freeRooms){ freeRooms = 0;}
        return freeRooms;
    }
    renderRoomsList() {
        const { url } = this.props.match;
        const { rooms_at } = this.props;
        let i = 0;
        if (rooms_at.length === 0) {
            return ;
        }
        return _.map(rooms_at, room => {
            return (
                <div key={room._id} className="col-sm-4">
                    <div className="text-center">
                        <h3 className=""><strong>Room No.{room.number}</strong></h3>
                        <p>Number of Beds: {room._bed_list.length}</p>
                        <p>Number of Patients: {room._bed_list.length - this.getFreeRooms(room)}</p>
                        <p>Number of Free Beds: {this.getFreeRooms(room)}</p>
                        <Link to={`${url}/room=${room._id}`} className="btn btn-default">Go</Link>
                    </div>
                </div>
            );
        });
    }
    
    render() {
        const { rooms_at, floor } = this.props;
        if (!rooms_at || !floor) {
            return (
                <div className="text-center">
                    <LoadingIndicator />
                </div>
            );
        }
        return (
            <div className="table-wrapper">
                <h3 className="text-center">{floor.number} Floor</h3>
                <Content>{this.renderRoomsList()}</Content>
            </div>
        );
    }
}
function mapStateToProps(state) {
    // console.log("hospitals log", hospitals[ownProps.match.params._id]);
    const { rooms_at, floor } = state.floors;
    return { rooms_at, floor };
}

export default connect(mapStateToProps, { fetchRoomsAt, fetchFloor })(FloorPage);