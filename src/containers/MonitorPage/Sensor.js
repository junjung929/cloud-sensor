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
import { SensorStream, ContentErr } from "../../components/";
import {
  Checkbox,
  Segment,
  Dropdown,
  Label,
  Sidebar,
  Button,
  Icon
} from "semantic-ui-react";

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
      updateSec: DEFAULT,
      toggle: false,
      visible: {
        HR: true,
        RR: true,
        SV: true,
        HRV: true,
        signalStrength: false
      },
      err: null
    };
    this.onSensorDataHandler = this.onSensorDataHandler.bind(this);
  }
  componentDidMount() {
    const { fetchSensor } = this.props;
    const { bed_ } = this.props.patient;
    if (!bed_) {
      this.setState({ err: "The patient is not set on any bed yet." });
      return alert(
        "The patient is not set on any bed yet.\nPlease set the patient on a bed."
      );
    } else {
      const { _sensor_node } = bed_;
      if (!_sensor_node) {
        this.setState({ err: "There's no sensor on the bed." });
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

  toggleVisibility = () => this.setState({ toggle: !this.state.toggle });

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
    if (this._mounted) {
      this.setState({ latestTime, sensorGraph });
    }

    return sensorGraph;
  };
  onSensorDataUpdateHandler = node => {
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

  renderGraphOption = items => {
    return _.map(items, item => {
      return (
        <Segment key={`sensor-checkbox-${item.key}`}>
          <Label className="">{item.label}</Label>
          <Checkbox
            className="pull-right"
            slider
            defaultChecked={item.visible}
            onChange={() => {
              let { visible } = this.state;
              Object.keys(visible).forEach(key => {
                if (key === item.key) {
                  visible[key] = !item.visible;
                }
              });
              this.setState({ visible });
            }}
          />
        </Segment>
      );
    });
  };
  render() {
    if (this.state.err) {
      return <ContentErr header={this.state.err} />;
    }
    const { sensor_data } = this.props;
    if (!sensor_data)
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );

    const { updateSec, visible } = this.state;
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
      <PatientInfo className={this.props.className}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Segment.Group}
            animation="push"
            width="thin"
            visible={this.state.toggle}
            icon="labeled"
          >
            {this.renderGraphOption([
              { key: "HR", label: "HR", visible: visible.HR },
              { key: "RR", label: "RR", visible: visible.RR },
              { key: "SV", label: "RSV", visible: visible.SV },
              { key: "HRV", label: "HRV", visible: visible.HRV },
              {
                key: "signalStrength",
                label: "SS",
                visible: visible.signalStrength
              }
            ])}
          </Sidebar>
          <Sidebar.Pusher>
            <SensorStream
              data={this.state.sensorGraph}
              title={this.props.title}
              visible={this.state.visible}
            />
          </Sidebar.Pusher>
        </Sidebar.Pushable>

        <div className="divisionLine" />
        <Button onClick={this.toggleVisibility}>
          <Icon name="eye" />Visibility
        </Button>
        <div className="pull-right">
          <Label>Update in: </Label>
          <Dropdown
            onChange={() => {
              this.onHandleChange();
            }}
            id="timeInterval"
            selection
            upward
            placeholder={updateString}
            options={[
              { key: "tenSec", value: "tenSec", text: "10 seconds" },
              { key: "oneMin", value: "oneMin", text: "1 minute" },
              { key: "tenMin", value: "tenMin", text: "1 minutes" },
              { key: "anHour", value: "anHour", text: "1 hour" },
              { key: "stop", value: "stop", text: "infinite" }
            ]}
          />
        </div>
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
