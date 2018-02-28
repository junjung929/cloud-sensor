import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchRoomsAt } from "../../actions";

import { SubProfile, NoResult, getOrdinal } from "../../components";
import { Content, ContentErr, Loading } from "./Components";

const PERPAGE = 3;
const PAGE = 0;

class Floor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floor_id: null
    };
  }
  componentDidMount() {
    console.log("Floor page mounted");
    const { floor_id } = this.props.match.params;
    this.setState({ floor_id });
    this.props.fetchRoomsAt(floor_id, PERPAGE, PAGE).then(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
  componentDidUpdate() {
    const { floor_id } = this.props.match.params;
    if (floor_id !== this.state.floor_id) {
      this.setState({ floor_id });
      this.props.fetchRoomsAt(floor_id, PERPAGE, PAGE).then(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
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
  renderRoomsList = (url, rooms) => {
    // get current floor id
    const { pathname } = this.props.location;
    let currItem = pathname.split("room=").pop();
    const sliceTill = currItem.search(/\//);
    if (sliceTill > 0) {
      currItem = currItem.slice(0, sliceTill);
    }

    if (!rooms || rooms.length === 0) {
      return <NoResult />;
    }
    return _.map(rooms, room => {
      let toRoom = `${url}/room=${room._id}#beds`;
      let spread = "Open";
      if (currItem === room._id) {
        toRoom = url;
        spread = "Close";
      }
      const extra = <Link to={toRoom}>{spread}</Link>;
      return (
        <SubProfile
          key={`room-profile-${room._id}`}
          color="olive"
          floated="right"
          size="mini"
          src={room.imgSrc}
          header={`Room No.${room.number}`}
          alt={`Room No.${room.number}`}
          meta="Rooms"
          description={
            <div>
              <p>Number of Beds: {room._bed_list.length}</p>
              <p>
                Number of Patients:{" "}
                {room._bed_list.length - this.getFreeRooms(room)}
              </p>
              <p>Number of Free Beds: {this.getFreeRooms(room)}</p>
            </div>
          }
          extra={extra}
        />
      );
    });
  };

  render() {
    const { rooms_at, floors_at } = this.props;
    const { floor_id } = this.props.match.params;
    const { url } = this.props.match;
    if (!rooms_at || !floors_at) {
      return <Loading inverted />;
    }
    if (rooms_at.err) {
      return <ContentErr id="rooms" message={rooms_at.err} />;
    }
    const { page, pages } = rooms_at;
    const floor = floors_at.floors.find(floor => {
      return floor._id === floor_id;
    });
    if (!floor) {
      return <div />;
    }
    return (
      <Content
        id="rooms"
        icon="hospital"
        header={`${getOrdinal(floor.number)} floor`}
        cards={() => this.renderRoomsList(url, rooms_at.rooms)}
        url={url}
        page={page}
        pages={pages}
        onLeftClick={() => {
          this.props.fetchRoomsAt(PERPAGE, page - 1);
        }}
        onRightClick={() => {
          this.props.fetchRoomsAt(PERPAGE, page + 1);
        }}
      />
    );
  }
}
function mapStateToProps(state) {
  const { floors_at } = state.hospitals;
  const { rooms_at } = state.floors;
  return { rooms_at, floors_at };
}

export default connect(mapStateToProps, { fetchRoomsAt })(Floor);
