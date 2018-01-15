import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPatient } from "actions";
import styled from "styled-components";

import { Table, BackToList } from "components";

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Content = styled.div``;

class PatientDataPage extends Component {
  constructor(props) {
    super(props);
  }
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

    return (
      <Info>
        <img
          src="https://www.planwallpaper.com/static/images/04c05a04079a978b0ffa50a1ae42f5a6.jpg"
          className="img-circle"
          style={{ width: 150, height: 150 }}
        />
        <Content>
          <h3>
            {patient.first_name} {patient.last_name}
          </h3>
          <p>Address: {patient.address}</p>
          <p>Tel. {patient.phone_number}</p>
          <p>Birthday: {birth}</p>
          <p>Enter Date: {enter_date}</p>
          <p>Leave Date: {leave_date}</p>
          <p>Hospital: {patient.hospital_.name}</p>
        </Content>
      </Info>
    );
  }
}
function mapStateToProps(state) {
  const { patient } = state.patients;
  return { patient };
}

export default connect(mapStateToProps, { fetchPatient })(PatientDataPage);
