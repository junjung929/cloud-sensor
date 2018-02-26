import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHospital, fetchFloorsAt } from "actions";

import { Card, Image, Icon, Button, Dimmer, Loader } from "semantic-ui-react";
import { getOrdinal } from "../../components";
import { Content } from "./styles";

const WhiteImg = require("../../assets/white-image.png");
const PERPAGE = 3;
const PAGE = 0;
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
    this.props.fetchFloorsAt(_id, PERPAGE, PAGE);
    this.setState({ _id });
  }
  componentDidUpdate() {
    const { _id } = this.props.match.params;
    if (_id !== this.state._id) {
      window.scrollTo(0, document.body.scrollHeight);
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
    const { floors } = floors_at;
    if (floors.length === 0) {
      return <div className="text-center">No result...</div>;
    }
    return _.map(floors, floor => {
      const { currItem } = this.state;
      const imgSrc = floor.imgSrc ? floor.imgSrc : String(WhiteImg);
      let toFloor = `${url}/floor=${floor._id}#rooms`;
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
        <Card key={`card-${floor._id}`} className="fadeIn">
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
    const { floors_at, hospital } = this.props;
    const { _id } = this.props.match.params;
    if (!floors_at || !hospital) {
      return (
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { page, pages } = floors_at;
    return (
      <Content id="hospital">
        <h3 className="text-center">
          <Icon name="hospital" />
          {hospital.name}
        </h3>
        <Card.Group style={{ justifyContent: "center" }}>
          {this.renderFloorsList()}
        </Card.Group>
        <Button.Group className="pull-right" style={{ margin: "10px" }}>
          <Button
            icon="angle left"
            disabled={page > 0 ? false : true}
            onClick={() => {
              this.props.fetchFloorsAt(_id, PERPAGE, page - 1);
            }}
          />
          <Button
            icon="angle right"
            disabled={page < Math.floor(pages) ? false : true}
            onClick={() => {
              this.props.fetchFloorsAt(_id, PERPAGE, page + 1);
            }}
          />
        </Button.Group>
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
