import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import { fetchHospital, fetchFloorsAt } from "actions";

import { Card, Image, Icon } from "semantic-ui-react";
import { getOrdinal } from "../../components";
import { Content } from "./styles";

const WhiteImg = require("../../assets/white-image.png");

class Hospital extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: null,
      currItem: ""
    };
  }
  componentDidMount() {
    console.log("Hospital page mounted");
    const { _id } = this.props.match.params;
    this.props.fetchHospital(_id);
    this.props.fetchFloorsAt(_id);
    this.setState({ _id });
  }
  componentDidUpdate() {
    const { _id } = this.props.match.params;
    if (_id !== this.state._id) {
      this.props.fetchHospital(_id);
      this.props.fetchFloorsAt(_id);
      this.setState({ _id });
    }
  }
  onItemClick(currId) {
    const { currItem } = this.state;
    if (currItem !== currId) {
      this.setState({ currItem: currId });
    } else {
      this.setState({ currItem: "" });
    }
  }
  renderFloorsList() {
    const { url } = this.props.match;
    const { floors_at } = this.props;
    if (!floors_at) {
      return <div className="text-center">No result...</div>;
    }
    if (floors_at.length === 0) {
      return <div className="text-center">No result...</div>;
    }
    return _.map(floors_at, floor => {
      const { currItem } = this.state;
      const imgSrc = floor.imgSrc ? floor.imgSrc : String(WhiteImg);
      let toFloor = `${url}/floor=${floor._id}`;
      let spread = "Open";
      if (currItem === floor._id) {
        toFloor = url;
        spread = "Close";
      }
      const extra = (
        <Link to={toFloor} onClick={() => this.onItemClick(floor._id)}>
          {spread}
        </Link>
      );
      return (
        <Card key={`card-${floor._id}`}>
          <Card.Content>
            <Image
              floated="right"
              size="mini"
              src={imgSrc}
              alt={`floor-${floor.number}-profile-image`}
            />
            <Card.Header>{getOrdinal(floor.number)} floor</Card.Header>
            <Card.Meta>Floors</Card.Meta>
            <Card.Description>
              <p>Number of Rooms: {floor._room_list.length}</p>{" "}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>{extra}</Card.Content>
        </Card>
      );
    });
  }
  render() {
    let { hospital } = this.props;
    if (!hospital) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    }
    return (
      <Content id="hospital">
        <h3 className="text-center">
          <Icon name="hospital" />
          {hospital.name}
        </h3>
        <Card.Group style={{ justifyContent: "center" }}>
          {this.renderFloorsList()}
        </Card.Group>
      </Content>
    );
  }
}
function mapStateToProps(state) {
  // console.log("hospitals log", hospitals[ownProps.match.params._id]);
  const { hospital, floors_at } = state.hospitals;

  return { hospital, floors_at };
}

export default connect(mapStateToProps, { fetchHospital, fetchFloorsAt })(
  Hospital
);
