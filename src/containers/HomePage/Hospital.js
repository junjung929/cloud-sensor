import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFloorsAt } from "../../actions";

import {
  SubProfile,
  NoResult,
  getOrdinal,
  ContentErr,
  Loading
} from "../../components";
import { Content } from "./Components";

const PERPAGE = 3;
const PAGE = 0;

class Hospital extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hospital_id: null
    };
  }
  componentDidMount() {
    console.log("Hospital page mounted");
    const { hospital_id } = this.props.match.params;
    this.setState({ hospital_id });
    this.props.fetchFloorsAt(hospital_id, PERPAGE, PAGE).then(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
  componentDidUpdate() {
    const { hospital_id } = this.props.match.params;
    if (hospital_id !== this.state.hospital_id) {
      this.setState({ hospital_id });
      this.props.fetchFloorsAt(hospital_id, PERPAGE, PAGE).then(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    }
  }
  renderFloorsList = (url, floors) => {
    // get current floor id
    const { pathname } = this.props.location;
    let currItem = pathname.split("floor=").pop();
    const sliceTill = currItem.search(/\//);
    if (sliceTill > 0) {
      currItem = currItem.slice(0, sliceTill);
    }

    if (!floors || floors.length === 0) {
      return <NoResult />;
    }
    return _.map(floors, floor => {
      let toFloor = `${url}/floor=${floor._id}#rooms`;
      let spread = "Open";
      if (currItem === floor._id) {
        toFloor = url;
        spread = "Close";
      }
      const extra = <Link to={toFloor}>{spread}</Link>;
      return (
        <SubProfile
          key={`floor-profile-${floor._id}`}
          color="green"
          floated="right"
          size="mini"
          src={floor.imgSrc}
          header={`${getOrdinal(floor.number)} floor`}
          alt={`${getOrdinal(floor.number)} floor`}
          meta="Floors"
          description={<p>Number of Rooms: {floor._room_list.length}</p>}
          extra={extra}
        />
      );
    });
  };
  render() {
    const { floors_at, hospitals } = this.props;
    const { hospital_id } = this.props.match.params;
    const { url } = this.props.match;
    if (!floors_at || !hospitals) {
      return <Loading />;
    }
    if (floors_at.err) {
      return <ContentErr id="floors" message={floors_at.err} />;
    }
    const { page, pages } = floors_at;
    const hospital = hospitals.hospitals.find(hospital => {
      return hospital._id === hospital_id;
    });
    if (!hospital) {
      return <div />;
    }
    return (
      <Content
        id="floors"
        icon="hospital"
        header={hospital.name}
        cards={() => this.renderFloorsList(url, floors_at.floors)}
        url={url}
        page={page}
        pages={pages}
        onLeftClick={() => {
          this.props.fetchFloorsAt(hospital_id, PERPAGE, page - 1);
        }}
        onRightClick={() => {
          this.props.fetchFloorsAt(hospital_id, PERPAGE, page + 1);
        }}
      />
    );
  }
}
function mapStateToProps(state) {
  const { hospitals, floors_at } = state.hospitals;

  return { hospitals, floors_at };
}

export default connect(mapStateToProps, { fetchFloorsAt })(Hospital);
