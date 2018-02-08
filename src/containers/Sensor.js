import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPatient, fetchSensor, fetchSensorData } from "../actions";
import styled from "styled-components";

import LoadingIndicator from "react-loading-indicator";
import { Table, BackToList, SensorStream } from "../components/";
import { clearInterval, clearTimeout } from "timers";

const TENSEC = 10000;
const DEFAULT = TENSEC * 6;
const PatientInfo = styled.div`
  width: 100%;
  padding: 0 3vw 0 3vw;
`;
class Sensor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sensorData: [],
      sensorGraph: {
        HR: [], //heartRate
        RR: [], //respirationRate
        SV: [], //relativeStrokeVolume
        HRV: [], //heartRateVariability
        signalStrength: [] // measured signal strength indication
        // status: [],
        // B2B: [], //beat2beat time
        // B2B1: [], //beat2beat time
        // B2B2: [] //beat2beat time
      },
      updateSec: DEFAULT
    };
    this.timer = this.timer.bind(this);
  }
  componentDidMount() {
    const { _id } = this.props.match.params;
    const { fetchPatient, fetchSensor } = this.props;
    fetchPatient(_id).then((err, callback) => {
      const { bed_ } = this.props.patient;
      if (!bed_) {
        return alert("The patient is not set on any bed yet.\nPlease set the patient on a bed.");
      } else {
        const { _sensor_node } = bed_;
        if (!_sensor_node) {
          return alert("There's no sensor on the bed.\nPlease deploy a sensor on the bed.");
        } else {
          fetchSensor(_sensor_node).then(() => {
            const { sensor } = this.props;
            this._mounted = true;
            console.log(sensor.node_name);
            this.timer(sensor.node_name);
          });
        }
      }
    });
  }
  componentWillUnmount() {
    this._mounted = false;
    console.log(this._mounted);
  }
  timer = node => {
    console.log("sensor gets");
    this.props.fetchSensorData(node).then((err, callback) => {
      if (!this.props.sensor_data) {
        return;
      }
      let { sensor_data } = this.props;
      let { sensorGraph } = this.state;
      console.log("Sensor mount status: ", this._mounted);
      // console.log("reset", this.state.sensorGraph)
      if (sensor_data.length !== sensorGraph.HR.length) {
        for (let index in sensorGraph) {
          sensorGraph[index] = [];
        }
        _.map(sensor_data, data => {
          sensorGraph.HR.push(data.HR);
          sensorGraph.RR.push(data.RR);
          sensorGraph.SV.push(data.SV);
          sensorGraph.HRV.push(data.HRV);
          sensorGraph.signalStrength.push(data.signalStrength);
        });
      }

      if (this._mounted) {
        this.setState({ sensorGraph });
        // console.log(this.state.sensorGraph)
        setTimeout(() => {
          this.timer(node);
        }, this.state.updateSec);
      }
    });
  };
  tableBody() {
    let i = 0;
    if (!this.props.sensor_data) {
      return (
        <td key={i++} colSpan="100%">
          <LoadingIndicator />
        </td>
      );
    }
    let { sensor_data } = this.props;
    let lastData = sensor_data[sensor_data.length - 1];
    return _.map(lastData, data => {
      if (i > 4) return;
      return <td key={i++}>{data[1]}</td>;
    });
  }
  chartData() {
    // if(!this.props.sensor_data) return null;
    let { sensorGraph } = this.state;
    return sensorGraph;
  }
  onHandleChange() {
    const timeInterval = document.getElementById("timeInterval").value;
    switch (timeInterval) {
      case "tenSec":
        this.setState({ updateSec: TENSEC });
        break;
      case "oneMin":
        this.setState({ updateSec: TENSEC * 6 });
        break;
      case "tenMin":
        this.setState({ updateSec: TENSEC * 60 });
        break;
      case "anHour":
        this.setState({ updateSec: TENSEC * 360 });
        break;
      case "stop":
        this.setState({ updateSec: 99999999 });
        break;
      default:
        this.setState({ updateSec: DEFAULT });
    }
  }
  render() {
    const { patient } = this.props;
    if (!patient)
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
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
        <th scope="row">{this.props.patient.first_name}</th>
        {this.tableBody()}
      </tr>
    );
    let data = null;
    return (
      <PatientInfo>
        <Table tableHeadRow={tableHeadRow} tableBody={tableBody} />
        <SensorStream data={this.chartData()} />
        <select
          onChange={() => {
            this.onHandleChange();
          }}
          className="pull-right"
          id="timeInterval"
        >
          <option>Set updating time</option>
          <option value="tenSec">10 seconds</option>
          <option value="oneMin">1 minute</option>
          <option value="tenMin">10 minutes</option>
          <option value="anHour">1 hour</option>
          <option value="stop">Stop updating</option>
        </select>
      </PatientInfo>
    );
  }
}
function mapStateToProps(state) {
  const { sensor } = state.sensors;
  const { sensor_data } = state.beds;
  const { patient } = state.patients;
  return { patient, sensor, sensor_data };
}

export default connect(mapStateToProps, {
  fetchPatient,
  fetchSensor,
  fetchSensorData
})(Sensor);
