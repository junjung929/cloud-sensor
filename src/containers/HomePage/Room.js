import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBedsAt } from "../../actions";

import { Profile, NoResult, getOrdinal } from "../../components";
import { Content, ContentErr, Loading } from "./Components";

const PERPAGE = 3;
const PAGE = 0;

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room_id: null
    };
  }
  componentDidMount() {
    console.log("Room mounted");
    const { room_id } = this.props.match.params;
    this.setState({ room_id });
    this.props.fetchBedsAt(room_id, PERPAGE, PAGE).then(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
  componentDidUpdate() {
    const { room_id } = this.props.match.params;
    if (room_id !== this.state.room_id) {
      this.setState({ room_id });
      this.props.fetchBedsAt(room_id, PERPAGE, PAGE).then(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    }
  }
  renderPatientsList = (url, beds) => {
    if (!beds || beds.length === 0) {
      return <NoResult />;
    }
    return _.map(beds, bed => {
      const { _patient } = bed;
      if (!_patient) {
        return <div />;
      }
      let dateFormat = require("dateformat");
      let birth = dateFormat(_patient.birth, "yyyy-mm-dd");
      let enter_date = dateFormat(_patient.enter_date, "yyyy-mm-dd");
      let leave_date = dateFormat(_patient.leave_date, "yyyy-mm-dd");
      let toPatient = `/monitor/patient=${_patient._id}`;
      let spread = "Go to monitor";

      const fullName = `${_patient.first_name} ${_patient.last_name}`;
      const extra = <Link to={toPatient}>{spread}</Link>;
      return (
        <Profile
          key={`patient-profile-${_patient._id}`}
          color="blue"
          src={_patient.imgSrc}
          header={`${fullName} at ${getOrdinal(bed.number)} bed`}
          alt={fullName}
          meta="Patients"
          size="small"
          description={
            <div>
              <p>Tel. {_patient.phone_number}</p>
              <p>Birthday: {birth}</p>
              <p>Enter Date: {enter_date}</p>
              <p>Leave Date: {leave_date}</p>
            </div>
          }
          extra={extra}
        />
      );
    });
  };
  render() {
    const { beds_at, rooms_at } = this.props;
    const { url } = this.props.match;
    const { room_id } = this.props.match.params;
    if (!beds_at || !rooms_at) {
      return <Loading inverted />;
    }

    if (beds_at.err) {
      return <ContentErr id="beds" message={beds_at.err} />;
    }
    const { pages, page } = beds_at;
    const room = rooms_at.rooms.find(room => {
      return room._id === room_id;
    });
    if (!room) {
      return <div />;
    }
    return (
      <Content
        id="beds"
        icon="hospital"
        header={`Room No.${room.number}`}
        cards={() => this.renderPatientsList(url, beds_at.beds)}
        url={url}
        page={page}
        pages={pages}
        onLeftClick={() => {
          this.props.fetchBedsAt(PERPAGE, page - 1);
        }}
        onRightClick={() => {
          this.props.fetchBedsAt(PERPAGE, page + 1);
        }}
      />
    );
  }
}
function mapStateToProps(state) {
  const { beds_at } = state.rooms;
  const { rooms_at } = state.floors;
  return { beds_at, rooms_at };
}

export default connect(mapStateToProps, {
  fetchBedsAt
})(Room);
