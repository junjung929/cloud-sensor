import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, initialize } from "redux-form";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchRoomsAt,
  fetchBedsAt,
  fetchSensors,
  fetchSensorsAt,
  fetchSensor,
  addSensor,
  editSensor,
  deleteSensor
} from "actions";
import Modal from "react-responsive-modal";

import {
  getOrdinal,
  Table,
  Profile,
  RenderField,
  RenderSelectField,
  RenderSelectGroupField,
  FormReset
} from "components";

import { Content } from "./styles";

class Sensors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalMode: null,
      open: false,
      updating: false,
      updatingText: null,
      currHospital: null,
      currFloor: null,
      currRoom: null,
      currBed: null,
      currSensor: null
    };
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { hospitals, hospital } = this.props;
    if (!hospitals) {
      this.props.fetchHospitals();
    }
    this.props.fetchSensors();
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  handleInitialize() {
    const { node_name, hospital_, floor_, room_, bed_ } = this.props.sensor;
    const { sensor } = this.props;
    const iniData = {
      node_name,
      hospital_: hospital_ ? hospital_._id : null,
      floor_: floor_ ? floor_._id : null,
      room_: room_ ? room_._id : null,
      bed_: bed_ ? bed_._id : null
    };
    this.props.initialize(iniData);
  }
  handleInitializeNull() {
    const iniData = null;
    this.props.initialize(iniData);
  }
  deleteSensor = sensorId => e => {
    onClick: if (
      window.confirm(
        "This behaviour will also affect all information which is childe components of this room.\nAre you sure to delete?"
      )
    ) {
      this.setState({ updating: true, updatingText: "initial" });
      this.props.fetchSensor(sensorId).then(() => {
        const { sensor } = this.props;
        this.props.deleteSensor(sensorId).then(callback => {
          this.setState({
            updatingText: `${sensor.node_name} has been successfully deleted!`
          });
          this.props.fetchSensorsAt(this.state.currHospital);
        });
      });
    }
  };
  addSensor = values => {
    this.props.addSensor(values).then(callback => {
      if (callback.err) {
        return this.setState({ updatingText: `${callback.err}` });
      }
      this.props;
      this.setState({
        updatingText: `${values.node_name} is added!`
      });
      this.props.fetchSensorsAt(values.hospital_);
      this.setState({ currHospital: values.hospital_ });
      this.onCloseModal();
    });
  };
  editSensor = (sensorId, values) => {
    this.props.editSensor(sensorId, values).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` });
      }
      this.props.fetchSensor(sensorId).then(() => {
        const { sensor } = this.props;
        this.props;
        this.setState({
          updatingText: `${values.node_name} is edited!`
        });
        this.props.fetchSensorsAt(this.state.currHospital);
        this.onCloseModal();
      });
    });
  };
  onFormSubmit = (data, mode, sensorId) => {
    console.log(data);
    if (!data) {
      return alert("dfa");
    }
    const { onSubmit } = this.state;

    this.setState({ updating: true, updatingText: "initial" });
    switch (mode) {
      case "add":
        console.log(data);
        this.addSensor(data);
        break;
      case "edit":
        this.editSensor(sensorId, data);
        break;
    }
  };
  onOpenModal(id) {
    const { modalMode } = this.state;
    this.props.fetchSensor(id).then(() => {
      const { sensor } = this.props;
      this.props.fetchFloorsAt(sensor.hospital_._id).then(() => {
        this.props.fetchRoomsAt(sensor.floor_._id).then(() => {
          this.props.fetchBedsAt(sensor.room_._id).then(() => {
            if (sensor && modalMode === "edit") {
              this.handleInitialize();
              this.setState({ open: true, currSensor: id });
            }
          });
        });
      });
    });
  }
  onCloseModal() {
    this.setState({
      open: false,
      currSensor: null
    });
    FormReset(this.props);
  }
  selectOptionHospital() {
    const { hospitals } = this.props;
    if (!hospitals) {
      return;
    }
    return _.map(hospitals, hospital => {
      return (
        <option key={hospital._id} value={hospital._id}>
          {hospital.name}
        </option>
      );
    });
  }
  selectOptionFloor() {
    const { floors_at } = this.props;
    if (!floors_at) {
      return;
    }
    return _.map(floors_at, floor => {
      return (
        <option key={floor._id} value={floor._id}>
          {getOrdinal(floor.number)} floor
        </option>
      );
    });
  }
  selectOptionRoom() {
    const { rooms_at } = this.props;
    if (!rooms_at) {
      return;
    }

    return _.map(rooms_at, room => {
      return (
        <option key={room._id} value={room._id}>
          Room {room.number}
        </option>
      );
    });
  }
  selectOptionBed() {
    const { beds_at } = this.props;
    if (!beds_at) {
      return;
    }

    return _.map(beds_at, bed => {
      return (
        <option key={bed._id} value={bed._id}>
          {getOrdinal(bed.number)}
        </option>
      );
    });
  }
  renderModal(mode) {
    // console.log(this.props.initialize)
    const { sensor, handleSubmit } = this.props;
    let title = "",
      submitHandler = "",
      placeholder = {
        node_name: "ex. BCG_sensor_xxxx",
        hospital_: { id: "", name: "Hospital" },
        floor_: { id: "", name: "Floor" },
        room_: { id: "", name: "Room" },
        bed_: { id: "", name: "Bed" },
        button: "Add"
      };
    switch (mode) {
      case "edit":
        if (!sensor) {
          return <div />;
        }
        title = `${sensor.node_name} Edit`;
        submitHandler = data => {
          this.onFormSubmit(data, mode, sensor._id);
        };
        const { hospital_, floor_, room_, bed_ } = sensor;
        placeholder.hospital_.id = hospital_ ? hospital_._id : null;
        placeholder.hospital_.name = hospital_ ? hospital_.name : null;
        placeholder.floor_.id = floor_ ? floor_._id : null;
        placeholder.floor_.name = floor_
          ? `${getOrdinal(floor_.number)} floor`
          : null;
        placeholder.room_.id = room_ ? room_._id : null;
        placeholder.room_.name = room_ ? `Room ${room_.number}` : null;
        placeholder.bed_.id = bed_ ? bed_._id : null;
        placeholder.bed_.name = bed_ ? `${getOrdinal(bed_.number)} bed` : null;
        placeholder.button = "Edit";
        break;
      default:
        title = "Add a sensor";
        submitHandler = data => {
          this.onFormSubmit(data, mode);
        };
    }

    return (
      <div>
        <h3>{title}</h3>
        <form
          id="sensorForm"
          className="form-group"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="divisionLine" />
          <Field
            label="Name of Sensor"
            name="node_name"
            type="text"
            placeholder={placeholder.node_name}
            component={RenderField}
          />
          <div className="divisionLine" />
          <label>Sensor Location</label>
          <div className="divisionLine" />
          <Field
            label=""
            name="hospital_"
            placeholder={placeholder.hospital_}
            component={RenderSelectGroupField}
            option={this.selectOptionHospital()}
            onChange={e => {
              this.props.fetchFloorsAt(e.target.value);
            }}
          />
          <Field
            label=""
            name="floor_"
            placeholder={placeholder.floor_}
            component={RenderSelectGroupField}
            option={this.selectOptionFloor()}
            onChange={e => this.props.fetchRoomsAt(e.target.value)}
          />
          <Field
            label=""
            name="room_"
            placeholder={placeholder.room_}
            component={RenderSelectGroupField}
            option={this.selectOptionRoom()}
            onChange={e => this.props.fetchBedsAt(e.target.value)}
          />
          <Field
            label=""
            name="bed_"
            placeholder={placeholder.bed_}
            component={RenderSelectGroupField}
            option={this.selectOptionBed()}
          />
          <div className="divisionLine" />
          <button type="submit" className="btn btn-primary">
            {placeholder.button}
          </button>
          <div
            className="btn btn-danger"
            onClick={() => {
              this.onCloseModal();
            }}
          >
            Cancel
          </div>
        </form>
      </div>
    );
  }
  renderSensors() {
    const { fetchSensorsAt, sensors_at } = this.props;
    let i = 0;
    if (!sensors_at) {
      return (
        <tr>
          <td colSpan="100%">
            Please select a hospital from above to see the list of sensors.
          </td>
        </tr>
      );
    }
    if (sensors_at.length < 1) {
      return (
        <tr>
          <td colSpan="100%">No result...</td>
        </tr>
      );
    }
    return _.map(sensors_at, sensor => {
      return (
        <tr key={sensor._id} id={sensor._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>{sensor.node_name ? sensor.node_name : "Empty"}</td>
          <td>{sensor.room_ ? sensor.room_.number : "Empty"}</td>
          <td>{sensor.bed_ ? getOrdinal(sensor.bed_.number) : "Empty"}</td>
          <td width="10%">
            <div
              className="btn btn-default"
              onClick={() => {
                this.setState({ modalMode: "edit" }, () => {
                  this.onOpenModal(sensor._id);
                });
              }}
            >
              Open
            </div>
          </td>
          <td width="10%">
            <div
              className="btn btn-danger"
              onClick={this.deleteSensor(sensor._id)}
            >
              Delete
            </div>
          </td>
        </tr>
      );
    });
  }
  renderSelect(items) {
    return _.map(items, item => {
      return (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      );
    });
  }
  render() {
    const { hospitals, sensors_at, sensors, sensor } = this.props;
    const { open, updating, updatingText, currSensor, modalMode } = this.state;
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Room</td>
        <td>Bed</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    );
    const tableBody = this.renderSensors();
    let modalContent = <LoadingIndicator />;
    if (!hospitals) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    }
    if (modalMode !== null) {
      modalContent = this.renderModal(modalMode);
    }
    return (
      <div id="sensors">
        <h3 className="text-center">Sensors</h3>

        <Content>
          <button
            className="btn btn-primary pull-left"
            onClick={() => {
              this.setState({ modalMode: "add", open: true });
              this.handleInitializeNull();
            }}
          >
            Add
          </button>
          <div className="form-group pull-right">
            <select
              className="form-control"
              onChange={e => {
                this.setState({ currHospital: e.target.value });
                this.props.fetchSensorsAt(e.target.value);
              }}
            >
              <option value="">Hospital</option>
              {this.renderSelect(hospitals)}
            </select>
          </div>
          <div className="divisionLine" />
          <Table tableHeadRow={tableHeadRow} tableBody={tableBody} />
        </Content>
        <Modal
          open={open}
          onClose={() => {
            this.onCloseModal();
          }}
        >
          {modalContent}
        </Modal>
        {/* updating alert modal */}
        <Modal
          open={updating}
          onClose={() => {
            this.onCloseModal();
          }}
        >
          {(() => {
            switch (updatingText) {
              case "initial":
                return <LoadingIndicator />;

                break;
              default:
                return (
                  <div>
                    <p>{updatingText}</p>
                    <button
                      className="btn btn-sm btn-default"
                      onClick={() => {
                        this.setState({ updating: false });
                      }}
                    >
                      Check
                    </button>
                  </div>
                );
            }
          })()}
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals, floors_at } = state.hospitals;
  const { floor, add_floor, edit_floor, rooms_at } = state.floors;
  const { beds_at } = state.rooms;
  const {
    sensors,
    sensor,
    sensors_at,
    add_sensor,
    edit_sensor
  } = state.sensors;

  return {
    hospitals,
    sensors,
    sensor,
    sensors_at,
    add_sensor,
    floors_at,
    rooms_at,
    beds_at
  };
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {};
  // Validate the inputs from 'values'
  let nameValidateRex = /^(BCG_sensor_)\d{4}$/;
  if (!nameValidateRex.exec(values.node_name)) {
    errors.node_name = `Please carefully enter the exactly same name with the configuration.`;
  }
  if (!values.hospital_) {
    errors.hospital_ = "";
  }
  if (!values.floor_) {
    errors.floor_ = "";
  }
  if (!values.room_) {
    errors.room_ = "";
  }
  if (!values.bed_) {
    errors.bed_ = "";
  }

  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: `SensorEditForm`
})(
  connect(mapStateToProps, {
    fetchHospitals,
    fetchHospital,
    fetchFloorsAt,
    fetchRoomsAt,
    fetchBedsAt,
    fetchSensors,
    fetchSensorsAt,
    fetchSensor,
    addSensor,
    editSensor,
    deleteSensor
  })(Sensors)
);
