import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPatient } from "../../actions";

import { Content } from "./styles";
import { Card, Image } from "semantic-ui-react";

const WhiteImg = require("../../assets/white-image.png");

class PatientDataPage extends Component {
  componentWillMount() {
    const { _id } = this.props.match.params;
    this.props.fetchPatient(_id);
  }
  componentDidUpdate() {}
  render() {
    const { patient } = this.props;

    if (!patient) {
      return (
        <div>
          No result... <a href="/home">Back to Home</a>
        </div>
      );
    }

    const dateFormat = require("dateformat");
    const birth = dateFormat(patient.birth, "yyyy-mm-dd");
    const enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
    const leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
    const imgSrc = patient.imgSrc ? patient.imgSrc : String(WhiteImg);
    const fullName = `${patient.first_name} ${patient.last_name}`;
    return (
      <Content>
        <Card
          key={`card-${patient._id}`}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "none",
            background: "inherit"
          }}
        >
          <Image
            style={{ marginLeft: "auto", marginRight: "auto" }}
            size="small"
            src={imgSrc}
            alt={`patient-${fullName}-profile-image`}
          />
          <Card.Content>
            <Card.Header style={{ color: "white" }}>{fullName}</Card.Header>
            <Card.Meta style={{ color: "grey" }}>Patients</Card.Meta>
            <Card.Description style={{ color: "white" }}>
              <p>Tel. {patient.phone_number}</p>
              <p>Birthday: {birth}</p>
              <p>Enter Date: {enter_date}</p>
              <p>Leave Date: {leave_date}</p>
            </Card.Description>
          </Card.Content>
        </Card>
      </Content>
    );
  }
}
function mapStateToProps(state) {
  const { patient } = state.patients;
  return { patient };
}

export default connect(mapStateToProps, { fetchPatient })(PatientDataPage);
