import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import { fetchRoomsAt, fetchFloor } from "../../actions";

import { Content } from "./styles";
import { Button, Card, Image, Icon } from "semantic-ui-react";
import { getOrdinal } from "../../components";

const WhiteImg = require("../../assets/white-image.png");

class FloorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floor: null,
      currItem: ""
    };
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
  onItemClick(currId) {
    const { currItem } = this.state;
    if (currItem != currId) {
      this.setState({ currItem: currId });
    } else {
      this.setState({ currItem: "" });
    }
  }
  getFreeRooms(room) {
    // map room bed list _patient
    // if _patient is undefined count up
    // return the count
    let cnt = 0;
    let freeRooms = _.map(room._bed_list, bed => {
      if (!bed._patient) {
        return ++cnt;
      }
    });
    freeRooms = freeRooms[room._bed_list.length - 1];
    if (!freeRooms) {
      freeRooms = 0;
    }
    return freeRooms;
  }
  renderRoomsList() {
    const { url } = this.props.match;
    const { rooms_at } = this.props;
    let i = 0;
    if (rooms_at.length === 0) {
      return <div className="text-center">No result...</div>;
    }
    return _.map(rooms_at, room => {
      const { currItem } = this.state;
      const imgSrc = room.imgSrc ? room.imgSrc : String(WhiteImg);
      let toRoom = `${url}/room=${room._id}`;
      let spread = "Open";
      if (currItem === room._id) {
        toRoom = url;
        spread = "Close";
      }
      const extra = (
        <Link to={toRoom} onClick={() => this.onItemClick(room._id)}>
          {spread}
        </Link>
      );
      return (
        <Card key={`card-${room._id}`}>
          <Image src={imgSrc} alt={`room-${room.number}-profile-image`} />
          <Card.Content>
            <Card.Header>Room No.{room.number}</Card.Header>
            <Card.Meta>Rooms</Card.Meta>
            <Card.Description>
              <p>Number of Beds: {room._bed_list.length}</p>
              <p>
                Number of Patients:{" "}
                {room._bed_list.length - this.getFreeRooms(room)}
              </p>
              <p>Number of Free Beds: {this.getFreeRooms(room)}</p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>{extra}</Card.Content>
        </Card>
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
      <Content id="Rooms">
        <h3 className="text-center">
          <Icon name="hospital" />
          {getOrdinal(floor.number)} floor
        </h3>
        <Card.Group style={{ justifyContent: "center" }}>
          {this.renderRoomsList()}
        </Card.Group>
      </Content>
    );
  }
}
function mapStateToProps(state) {
  // console.log("hospitals log", hospitals[ownProps.match.params._id]);
  const { rooms_at, floor } = state.floors;
  return { rooms_at, floor };
}

export default connect(mapStateToProps, { fetchRoomsAt, fetchFloor })(
  FloorPage
);
