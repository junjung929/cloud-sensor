import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'react-loading-indicator';
import { fetchBedsAt, fetchRoom } from 'actions';
import styled from 'styled-components'

//components
import { Table } from 'components';

const Content = styled.div`
    display: flex;
    justify-content: center;`;

class RoomPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            room: null
        }
    }
    componentDidMount() {
        const { room } = this.props.match.params;
        console.log("Room mounted");
        this.props.fetchBedsAt(room);
        this.props.fetchRoom(room);
        this.setState({ room });
    }
    componentDidUpdate() {
        const { room } = this.props.match.params;
        if (room != this.state.room) {
            this.props.fetchBedsAt(room);
            this.props.fetchRoom(room);
            this.setState({ room });
        }
    }
    componentWillUnmount() {
        console.log("Room unmounted");
    }
    renderPatientsList() {
        let i = 0;
        const { beds_at } = this.props;
        const { url } = this.props.match;
        if (beds_at.length === 0) {
            return ;
        }
        return _.map(beds_at, bed => {
            let patient = bed._patient;
            if (!patient) {
                if (i === 0) { return ; }
                return (<tr key={bed._id} />);
            }
            let dateFormat = require('dateformat');
            let birth = dateFormat(patient.birth, "yyyy-mm-dd");
            let enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
            let leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
            return (
                
                <div key={bed._id} className="col-sm-4">
                <div className="text-center">
                    <h3 className=""><strong>{patient.first_name} {patient.last_name}</strong></h3>
                    <p>Tel. {patient.phone_number}</p>
                    <p>Birthday: {birth}</p>
                    <p>Enter Date: {enter_date}</p>
                    <p>Leave Date: {leave_date}</p>
                    <Link to={`/monitor/patient=${patient._id}`} className="btn btn-default">
                        Go
                    </Link>
                </div>
            </div>
            );
        });
    }
    render() {
        const { beds_at, room } = this.props;
        if (!beds_at || !room) {
            return (
                <div className="text-center">
                    <LoadingIndicator />
                </div>
            );
        }
        return (
            <div className="table-wrapper">
                <h3 className="text-center">Room No.{room.number}</h3>
                <Content>{this.renderPatientsList()}</Content>
            </div>
        );
    }
}
function mapStateToProps(state) {
    // console.log("hospitals log", hospitals[ownProps.match.params._id]);
    const { room, beds_at } = state.rooms
    return { beds_at, room };
}

export default connect(mapStateToProps, { fetchBedsAt, fetchRoom })(RoomPage);