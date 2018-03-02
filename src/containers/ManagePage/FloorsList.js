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
import { RenderList, RenderListItem } from "./Components";
import { LinkStyle } from "./styles";
import { Dimmer, Loader, Segment, List, Button } from "semantic-ui-react";

const PERPAGE = 5,
  PAGE = 0;
class FloorsList extends Component {
  render() {
    const { match, floors } = this.props;
    const { url } = match;
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
              //   this.props.fetchRoomsAt(_id, PERPAGE, PAGE);
            }}
          >
            {getOrdinal(number)} floor
          </Link>
          <List size="small">
            <Route
              path={`${url}/floor=${_id}`}
              component={({ match }) => {
                return <div />;
                // return this.renderRoomsList(match);
              }}
            />
          </List>
        </List.Item>
      );
    });
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
})(FloorsList);
