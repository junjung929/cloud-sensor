import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchFloor,
  fetchRoomsAt,
  fetchRoom,
  fetchBedsAt,
  fetchBed
} from "actions";
import { Link } from "react-router-dom";
import { getOrdinal } from "../../components";
import { Dimmer, Loader, Segment, List } from "semantic-ui-react";

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
  onBedClick(id) {
    const { fetchBed } = this.props;
    const { bedSelected } = this.state;
    fetchBed(id);
    this.setState({ bedSelected: id === bedSelected ? null : id });
  }
  onRoomClick(id) {
    const { fetchRoom, fetchBedsAt } = this.props;
    const { roomSelected } = this.state;
    fetchRoom(id);
    fetchBedsAt(id);
    this.setState({ roomSelected: id === roomSelected ? null : id });
  }
  onFloorClick(id) {
    const { fetchFloor, fetchRoomsAt } = this.props;
    const { floorSelected } = this.state;
    fetchFloor(id);
    fetchRoomsAt(id);
    this.setState({
      floorSelected: id === floorSelected ? null : id,
      roomSelected: null
    });
  }
  onHospitalClick(id) {
    const { fetchHospital, fetchFloorsAt } = this.props;
    const { hospitalSelected } = this.state;
    fetchHospital(id);
    fetchFloorsAt(id);
    this.setState({
      hospitalSelected: id === hospitalSelected ? null : id,
      floorSelected: null,
      roomSelected: null
    });
  }
  renderBedsList() {
    const { beds_at } = this.props;
    const { bedSelected } = this.state;
    let items = <div />;
    if (!beds_at) {
      return (
        <Dimmer>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { beds } = beds_at;
    return _.map(beds, bed => {
      const { _id, number } = bed;
      if (bedSelected === _id) {
        // items = this.renderBedsList();
      } else {
        items = <div />;
      }

      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          {getOrdinal(number)} bed
          <List size="small">{items}</List>
        </List.Item>
      );
    });
  }
  renderRoomsList() {
    const { rooms_at } = this.props;
    const { hospitalSelected, floorSelected, roomSelected } = this.state;
    let items = <div />;
    if (!rooms_at) {
      return (
        <Dimmer>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { rooms } = rooms_at;
    return _.map(rooms, room => {
      const { _id, number } = room;
      if (roomSelected === _id) {
        items = this.renderBedsList();
      } else {
        items = <div />;
      }

      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/manage/hospital=${hospitalSelected}/floor=${floorSelected}/room=${_id}/`}
            onClick={() => {
              this.onRoomClick(_id);
            }}
          >
            {" "}
            Room {number}
          </Link>
          <List size="small">{items}</List>
        </List.Item>
      );
    });
  }
  renderFloorsList() {
    const { floors_at } = this.props;
    const { hospitalSelected, floorSelected } = this.state;
    let items = <div />;
    if (!floors_at) {
      return (
        <Dimmer>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { floors } = floors_at;
    return _.map(floors, floor => {
      const { _id, number } = floor;
      if (floorSelected === _id) {
        items = this.renderRoomsList();
      } else {
        items = <div />;
      }

      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/manage/hospital=${hospitalSelected}/floor=${_id}/`}
            onClick={() => {
              this.onFloorClick(_id);
            }}
          >
            {getOrdinal(number)} floor
          </Link>
          <List size="small">{items}</List>
        </List.Item>
      );
    });
  }
  renderHospitalsList() {
    const { hospitals } = this.props;
    const { hospitalSelected } = this.state;
    let items = <div />;
    let selected = false;
    if (!hospitals) {
      return (
        <Dimmer>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    return _.map(hospitals.hospitals, hospital => {
      const { _id, name } = hospital;
      if (hospitalSelected === _id) {
        items = this.renderFloorsList();
        selected = true;
      } else {
        items = <div />;
        selected = false;
      }

      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          <Link
            to={`/manage/hospital=${_id}/`}
            onClick={() => {
              this.onHospitalClick(_id);
            }}
          >
            <List
              key={_id}
              style={
                selected
                  ? {
                      backgroundColor: "#00A4A4",
                      marginLeft: "-14px",
                      marginRight: "-14px"
                    }
                  : {}
              }
            >
              {name}
            </List>
          </Link>
          <List size="small">{items}</List>
        </List.Item>
      );
    });
  }

  render() {
    return (
      <Segment inverted style={{ width: "100%", textAlign: "left" }}>
        <List size="huge">{this.renderHospitalsList()}</List>
      </Segment>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals, hospital, floors_at } = state.hospitals;
  const { floor, rooms_at } = state.floors;
  const { room, beds_at } = state.rooms;
  const { bed } = state.beds;
  return {
    hospitals,
    hospital,
    floors_at,
    floor,
    rooms_at,
    room,
    beds_at,
    bed
  };
}

export default connect(mapStateToProps, {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchFloor,
  fetchRoomsAt,
  fetchRoom,
  fetchBedsAt,
  fetchBed
})(HospitalsList);
