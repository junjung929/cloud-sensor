import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchFloor,
  fetchRoomsAt,
  fetchRoom
} from "actions";
import { Link } from "react-router-dom";

import styled from "styled-components";

const ListGroup = styled.ul`
  padding-left: 2vw;
`;
const ListGroupItem = styled.li`
  list-style-type: none;
`;
class HospitalsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hospitalSelected: null,
      floorSelected: null,
      roomSelected: null,
      bedSelected: null
    };
  }
  componentDidMount() {
    const { hospitals, fetchHospitals } = this.props;
    if (!hospitals) {
      fetchHospitals();
    }
  }
  onRoomClick(id) {
    const { room, fetchRoom } = this.props;
    const { roomSelected } = this.state;
    fetchRoom(id);
    this.setState({ roomSelected: id === roomSelected ? null : id });
  }
  onFloorClick(id) {
    const { floor, fetchFloor, fetchRoomsAt } = this.props;
    const { floorSelected } = this.state;
    fetchFloor(id);
    fetchRoomsAt(id)
    this.setState({ floorSelected: id === floorSelected ? null : id });
  }
  onHospitalClick(id) {
    const { hospital, fetchHospital, fetchFloorsAt } = this.props;
    const { hospitalSelected } = this.state;
    fetchHospital(id);
    fetchFloorsAt(id);
    this.setState({ hospitalSelected: id === hospitalSelected ? null : id });
  }
  renderRoomsList() {
    const { rooms_at } = this.props;
    const { hospitalSelected, floorSelected, roomSelected } = this.state;
    let items = <div />;
    if (!rooms_at) {
      return <div />;
    }
    return _.map(rooms_at, room => {
      const { _id, number } = room;
      if (roomSelected === _id) {
        // items = this.renderBedsList();
      } else {
        items = <div />;
      }

      return (
        <ListGroup key={_id}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/manage/hospital=${hospitalSelected}/floor=${floorSelected}/room=${_id}/`}
            onClick={() => {
              this.onRoomClick(_id);
            }}
          >
            {" "}
            - Room {number}
          </Link>
          {items}
        </ListGroup>
      );
    });
  }
  renderFloorsList() {
    const { floors_at } = this.props;
    const { hospitalSelected, floorSelected } = this.state;
    let items = <div />;
    if (!floors_at) {
      return <div />;
    }
    return _.map(floors_at, floor => {
      const { _id, number, hospital_ } = floor;
      if (floorSelected === _id) {
        items = this.renderRoomsList();
      } else {
        items = <div />;
      }

      return (
        <ListGroup key={_id}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/manage/hospital=${hospitalSelected}/floor=${_id}/`}
            onClick={() => {
              this.onFloorClick(_id);
            }}
          >
            {" "}
            - {number} floor
          </Link>
          {items}
        </ListGroup>
      );
    });
  }
  renderHospitalsList() {
    const { hospitals } = this.props;
    const { hospitalSelected } = this.state;
    let items = <div />;
    return _.map(hospitals, hospital => {
      const { _id, name } = hospital;
      if (hospitalSelected === _id) {
        items = this.renderFloorsList();
      } else {
        items = <div />;
      }

      return (
        <ListGroup key={_id}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/manage/hospital=${_id}/`}
            onClick={() => {
              this.onHospitalClick(_id);
            }}
          >
            {" "}
            - {name}
          </Link>
          {items}
        </ListGroup>
      );
    });
  }
  render() {
    return <ListGroup>{this.renderHospitalsList()}</ListGroup>;
  }
}

function mapStateToProps(state) {
  const { hospitals, hospital, floors_at } = state.hospitals;
  const { floor, rooms_at } = state.floors;
  const { room } = state.rooms;
  return {
    hospitals,
    hospital,
    floors_at,
    floor,
    rooms_at,
    room
  };
}

export default connect(mapStateToProps, {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchFloor,
  fetchRoomsAt,
  fetchRoom
})(HospitalsList);
