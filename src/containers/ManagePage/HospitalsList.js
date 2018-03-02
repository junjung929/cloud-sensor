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
} from "../../actions";
import { Link, Route } from "react-router-dom";
import { getOrdinal } from "../../components";
import { FloorsList } from "../ManagePage";
import { RenderList, RenderListItem } from "./Components";
import { LinkStyle } from "./styles";
import { Dimmer, Loader, Segment, List, Button } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;
class HospitalsList extends Component {
  componentDidMount() {
    console.log(this.props.match.params);
    if (!this.props.hospitals) {
      this.props.fetchHospitals(PERPAGE, PAGE);
    }
  }
  renderBedsList = ({ url }) => {
    const { beds_at } = this.props;
    if (!beds_at) {
      return <Loader active inline="centered" />;
    }
    const { beds } = beds_at;
    return _.map(beds, bed => {
      const { _id, number } = bed;
      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          {getOrdinal(number)} bed
        </List.Item>
      );
    });
  };
  renderRoomsList = ({ url }) => {
    const { rooms_at } = this.props;
    if (!rooms_at) {
      return <Loader active inline="centered" />;
    }
    const { rooms } = rooms_at;
    return _.map(rooms, room => {
      const { _id, number } = room;

      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`${url}/room=${_id}/`}
            onClick={() => {
              this.props.fetchBedsAt(_id, PERPAGE, PAGE);
            }}
          >
            Room {number}
          </Link>
          <List size="small">
            <Route
              path={`${url}/room=${_id}`}
              component={({ match }) => {
                return this.renderBedsList(match);
              }}
            />
          </List>
        </List.Item>
      );
    });
  };
  renderFloorsList = ({ url }, floors) => {
    if (!floors || floors.length === 0) {
      return <div />;
    }
    return _.map(floors, floor => {
      const { _id, number } = floor;

      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`${url}/floor=${_id}`}
            onClick={() => {
              this.props.fetchRoomsAt(_id, PERPAGE, PAGE);
            }}
          >
            {getOrdinal(number)} floor
          </Link>
          <List size="small">
            <Route
              path={`${url}/floor=${_id}`}
              component={({ match }) => {
                return this.renderRoomsList(match);
              }}
            />
          </List>
        </List.Item>
      );
    });
  };
  renderHospitalsList = (hospitals, url) => {
    if (!hospitals || !hospitals.length === 0) {
      return <div />;
    }
    return _.map(hospitals, hospital => {
      const { _id, name } = hospital;
      return (
        <List.Item key={_id} style={{ textAlign: "left" }}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`${url}/hospital=${_id}`}
            onClick={() => {
              this.props.fetchFloorsAt(_id, PERPAGE, PAGE);
            }}
          >
            <LinkStyle>
              <List>{name}</List>
            </LinkStyle>
          </Link>
          <List size="small">
            <Route
              path={`${url}/hospital=${_id}`}
              component={({ match }) => {
                const { floors_at } = this.props;
                if (!floors_at) {
                  return <Loader active inline="centered" />;
                }
                const { floors, pages, page } = floors_at;
                return <FloorsList match={match} floors={floors} />;
              }}
            />
          </List>
        </List.Item>
      );
    });
  };

  render() {
    if (!this.props.hospitals) {
      return (
        <Dimmer>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { page, pages, hospitals } = this.props.hospitals;
    const { url } = this.props.match;
    return (
      <Segment inverted style={{ width: "100%", textAlign: "left" }}>
        <RenderList
          size="huge"
          listItems={this.renderHospitalsList(hospitals, url)}
          pages={pages}
          page={page}
          btnSize="medium"
          onClickPrev={() => this.props.fetchHospitals(PERPAGE, page - 1)}
          onClickNext={() => this.props.fetchHospitals(PERPAGE, page + 1)}
        />
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
