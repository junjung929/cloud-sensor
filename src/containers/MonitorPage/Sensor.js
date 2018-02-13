import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchSensor,
  fetchSensorData,
  fetchUpdatedSensorData
} from "../../actions";
import styled from "styled-components";

import LoadingIndicator from "react-loading-indicator";
import { Table, BackToList, SensorStream } from "../../components/";
import { clearInterval, clearTimeout } from "timers";

const TENSEC = 10000;
const DEFAULT = TENSEC * 6;
const PatientInfo = styled.div``;
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
        signalStrength: [], // measured signal strength indication
        // status: [],
        // B2B: [], //beat2beat time
        // B2B1: [], //beat2beat time
        // B2B2: [] //beat2beat time
        latestTime: 0
      },
      updateSec: DEFAULT
    };
    this.onSensorDataHandler = this.onSensorDataHandler.bind(this);
  }
  componentDidMount() {
    const { _id } = this.props.patient;
    const { fetchPatient, fetchSensor } = this.props;
    const { bed_ } = this.props.patient;
    if (!bed_) {
      return alert(
        "The patient is not set on any bed yet.\nPlease set the patient on a bed."
      );
    } else {
      const { _sensor_node } = bed_;
      if (!_sensor_node) {
        return alert(
          "There's no sensor on the bed.\nPlease deploy a sensor on the bed."
        );
      } else {
        fetchSensor(_sensor_node).then(() => {
          const { sensor } = this.props;
          this._mounted = true;
          console.log(sensor.node_name);
          this.onSensorDataHandler(sensor.node_name);
        });
      }
    }
  }
  componentWillUnmount() {
    this._mounted = false;
    console.log(this._mounted);
  }
  onSensorDataPushHandler = sensorData => {
    let { sensorGraph } = this.state;
    let latestTime;
    _.map(sensorData, ({ data, time }) => {
      for (let i = 0; i < 30; i++) {
        sensorGraph.HR.push(data.HR[i]);
        sensorGraph.RR.push(data.RR[i]);
        sensorGraph.SV.push(data.SV[i]);
        sensorGraph.HRV.push(data.HRV[i]);
        sensorGraph.signalStrength.push(data.signalStrength[i]);
      }
    });
    latestTime = _.findLast(sensorData).time;
    this.setState({ latestTime, sensorGraph });

    return sensorGraph;
  };
  onSensorDataUpdateHandler = node => {
    let { sensor_data } = this.props;
    this.props.fetchUpdatedSensorData(node).then(data => {
      if (data.time !== this.state.latestTime) {
        this.onSensorDataPushHandler({ data });
      }
      if (this._mounted) {
        setTimeout(() => {
          this.onSensorDataUpdateHandler(node);
        }, this.state.updateSec);
      }
    });
  };
  onSensorDataHandler = node => {
    console.log("sensor gets");
    this.props.fetchSensorData(node).then((err, callback) => {
      if (!this.props.sensor_data) {
        return;
      }
      let { sensor_data } = this.props;
      let { sensorGraph } = this.state;
      console.log("Sensor mount status: ", this._mounted);
      this.onSensorDataPushHandler(sensor_data);
      this.onSensorDataUpdateHandler(node);
    });
  };
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
    const { sensor_data } = this.props;
    if (!sensor_data)
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    let data = null;
    const { updateSec } = this.state;
    let updateString;
    if (updateSec === 10000) {
      updateString = "10 sec";
    } else if (updateSec === 60000) {
      updateString = "1 min";
    } else if (updateSec === 600000) {
      updateString = "10 mins";
    } else if (updateSec === 360000) {
      updateString = "an hour";
    } else {
      updateString = "unlimited";
    }
    return (
      <PatientInfo className={this.props.className} >
        <SensorStream data={this.state.sensorGraph} />
        <select
          onChange={() => {
            this.onHandleChange();
          }}
          className="pull-right"
          id="timeInterval"
        >
          <option>Update in {updateString}</option>
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
  const { sensor_data, updated_sensor_data } = state.beds;
  return { sensor, sensor_data, updated_sensor_data };
}

export default connect(mapStateToProps, {
  fetchSensor,
  fetchSensorData,
  fetchUpdatedSensorData
})(Sensor);
