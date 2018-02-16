import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import { fetchBedsAt, fetchRoom } from "../../actions";

import { Content } from "./styles";
import { Card, Image, Icon } from "semantic-ui-react";
import { getOrdinal } from "../../components";

const WhiteImg = require("../../assets/white-image.png");

class RoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: null
    };
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
    if (room !== this.state.room) {
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
    if (beds_at.length === 0) {
      return <div className="text-center">No result...</div>;
    }
    return _.map(beds_at, bed => {
      const { _patient } = bed;
      if (!_patient) {
        if (i === 0) {
          return;
        }
        return <tr key={bed._id} />;
      }
      let dateFormat = require("dateformat");
      let birth = dateFormat(_patient.birth, "yyyy-mm-dd");
      let enter_date = dateFormat(_patient.enter_date, "yyyy-mm-dd");
      let leave_date = dateFormat(_patient.leave_date, "yyyy-mm-dd");
      const imgSrc = _patient.imgSrc ? _patient.imgSrc : String(WhiteImg);
      let toPatient = `/monitor/patient=${_patient._id}`;
      let spread = "Go to monitor";

      const fullName = `${_patient.first_name} ${_patient.last_name}`;
      const extra = <Link to={toPatient}>{spread}</Link>;
      return (
        <Card key={`card-${_patient._id}`}>
          <Image
            style={{ marginLeft: "auto", marginRight: "auto" }}
            size="small"
            src={imgSrc}
            alt={`patient-${fullName}-profile-image`}
          />
          <Card.Content>
            <Card.Header>
              {fullName} at {getOrdinal(bed.number)} bed
            </Card.Header>
            <Card.Meta>Patients</Card.Meta>
            <Card.Description>
              <p>Tel. {_patient.phone_number}</p>
              <p>Birthday: {birth}</p>
              <p>Enter Date: {enter_date}</p>
              <p>Leave Date: {leave_date}</p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>{extra}</Card.Content>
        </Card>
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
      <Content id="beds">
        <h3 className="text-center">
          <Icon name="hospital" />Room No.{room.number}
        </h3>
        <Card.Group style={{ justifyContent: "center" }}>
          {this.renderPatientsList()}
        </Card.Group>
      </Content>
    );
  }
}
function mapStateToProps(state) {
  // console.log("hospitals log", hospitals[ownProps.match.params._id]);
  const { room, beds_at } = state.rooms;
  return { beds_at, room };
}

export default connect(mapStateToProps, {
  fetchBedsAt,
  fetchRoom
})(RoomPage);
