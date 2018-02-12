import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUpdatedSensorData } from "../../actions";
import { Table } from "../../components/";
import LoadingIndicator from "react-loading-indicator";

class MonitorTable extends Component {
  componentDidMount() {}
  tableBody() {
    const { updated_sensor_data } = this.props;
    let i = 0;

    if (!updated_sensor_data) {
      return (
        <td key={i++} colSpan="100%">
          <LoadingIndicator />
        </td>
      );
    }
    const { data } = updated_sensor_data;
    return _.map(data, element => {
      if (i > 4) {
        return;
      }
      return <td key={i++}>{_.findLast(element)[1]}</td>;
    });
  }

  render() {
    const {patient} = this.props;
    let tableHeadRow = (
      <tr>
        <th>Name</th>
        <th>Heart rate (bpm)</th>
        <th>Respiration rate (rpm)</th>
        <th>Relative stroke volume (um)</th>
        <th>Heart rate variability (ms)</th>
        <th>Measured signal strength</th>
      </tr>
    );
    let tableBody = (
      <tr>
        <th scope="row">{patient.first_name}</th>
        {this.tableBody()}
      </tr>
    );
    return <Table tableHeadRow={tableHeadRow} tableBody={tableBody} />;
  }
}
function mapStateToProps(state) {
  const { updated_sensor_data } = state.beds;
  return { updated_sensor_data };
}
export default connect(mapStateToProps, { fetchUpdatedSensorData })(
  MonitorTable
);
