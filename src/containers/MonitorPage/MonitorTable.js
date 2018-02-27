import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUpdatedSensorData } from "../../actions";
import { Table } from "../../components/";
import { Loading } from "./Components";

class MonitorTable extends Component {
  componentDidMount() {}
  tableBody = ({ first_name }, { data }) => {
    let i = 0;

    if (!data) {
      return;
    }
    return [
      [<strong>{first_name}</strong>].concat(
        _.map(data, element => {
          if (i++ < 5) return _.findLast(element)[1];
        })
      )
    ];
  };

  render() {
    const { patient } = this.props;
    const { updated_sensor_data } = this.props;
    if (!updated_sensor_data) {
      return <Loading />;
    }
    const tableHeadRow = [
      "Name",
      "Heart rate (bpm)",
      "Respiration rate (rpm)",
      "Relative stroke volume (um)",
      "Heart rate variability (ms)",
      "Measured signal strength"
    ];
    const tableBody = this.tableBody(patient, updated_sensor_data);
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
