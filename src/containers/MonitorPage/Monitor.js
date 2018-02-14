import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPatient } from "../../actions";
import LoadingIndicator from "react-loading-indicator";
import { MonitorTable, Sensor } from "../MonitorPage";

import styled from "styled-components";
const PatientInfo = styled.div`
  width: 100%;
  padding: 0 3vw 0 3vw;
`;
class Monitor extends Component {
  componentDidMount() {
    const { _id } = this.props.match.params;
    this.props.fetchPatient(_id);
  }
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <LoadingIndicator />;
    }
    const fullname = `${patient.first_name} ${patient.last_name}`
    return (
      <PatientInfo>
        <MonitorTable patient={patient} />
        <Sensor patient={patient} title={fullname} />
      </PatientInfo>
    );
  }
}
function mapStateToProps(state) {
  const { patient } = state.patients;
  return { patient };
}
export default connect(mapStateToProps, { fetchPatient })(Monitor);
