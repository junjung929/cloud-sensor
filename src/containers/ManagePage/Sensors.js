import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
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
} from "../../actions";

import {
  getOrdinal,
  Loading,
  ContentErr,
  Table,
  RenderFields,
  RenderField,
  RenderSelectGroupField
} from "../../components";
import { ModalContent as Modal, LoaderModal, DeleteModal } from "./Components";

import { Button, Icon, Form } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;
const FORMID = "patientForm";

class Sensors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currHospital: "",
      currFloor: null,
      currRoom: null,
      currBed: null,
      currPatient: null,
      page: 0,
      err: "",
      editItem: null,
      deleteItem: null,
      modalMode: null,
      openAddModal: false,
      openEditModal: false,
      openLoadModal: false,
      openDeleteModal: false,
      formResponse: false
    };
  }
  componentDidMount() {
    this.props.fetchHospitals();
    this.props.fetchSensors(PERPAGE, PAGE);
  }
  refetchSensors = () => {
    const { currHospital } = this.state;
    let { page } = this.state;
    this.props.fetchSensorsAt(currHospital, PERPAGE, page).then(({ data }) => {
      const { sensors, pages } = data;
      if (sensors.length === 0 && pages >= 1) {
        page -= 1;
        this.props.fetchSensorsAt(currHospital, PERPAGE, page);
        this.setState({ page });
      }
    });
  };
  handleInitialize = (sensor, additionalInit) => {
    const { node_name, hospital_, floor_, room_, bed_ } = sensor;
    let iniData = {
      node_name,
      hospital_: hospital_ ? hospital_._id : "",
      floor_: floor_ ? floor_._id : "",
      room_: room_ ? room_._id : "",
      bed_: bed_ ? bed_._id : ""
    };
    if (additionalInit) {
      iniData = Object.assign(iniData, additionalInit);
    }
    console.log(iniData);
    return iniData;
  };
  deleteSensor = sensorId => e => {
    this.setState({ openLoadModal: true });
    this.props
      .deleteSensor(sensorId)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openDeleteModal: false });
        this.refetchSensors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  addSensor = values => {
    this.props
      .addSensor(values)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openAddModal: false });
        this.refetchSensors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  editSensor = (sensorId, values) => {
    this.props
      .editSensor(sensorId, values)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openEditModal: false });
        this.refetchSensors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  onFormSubmit = (data, mode, sensorId) => {
    this.setState({ openLoadModal: true });
    switch (mode) {
      case "edit":
        this.editSensor(sensorId, data);
        break;
      default:
        this.addSensor(data);
    }
  };
  selectOptionHospital() {
    const { hospitals } = this.props;
    if (!hospitals) {
      return;
    }
    return _.map(hospitals.hospitals, hospital => {
      return (
        <option key={hospital._id} value={hospital._id}>
          {hospital.name}
        </option>
      );
    });
  }
  selectOptionFloor = () => {
    const { floors_at } = this.props;
    if (!floors_at) {
      return;
    }
    return _.map(floors_at.floors, floor => {
      return (
        <option key={floor._id} value={floor._id}>
          {getOrdinal(floor.number)} floor
        </option>
      );
    });
  };
  selectOptionRoom = rooms => {
    if (!rooms) {
      return;
    }

    return _.map(rooms, room => {
      return (
        <option key={room._id} value={room._id}>
          Room {room.number}
        </option>
      );
    });
  };
  selectOptionBed = beds => {
    if (!beds) {
      return;
    }

    return _.map(beds, bed => {
      return (
        <option key={bed._id} value={bed._id}>
          {getOrdinal(bed.number)}
        </option>
      );
    });
  };
  renderModal = (mode, sensor) => {
    // console.log(this.props.initialize)
    const { handleSubmit } = this.props;
    let submitHandler = data => {
      this.onFormSubmit(data, mode);
    };
    let placeholder = {
      node_name: "ex. BCG_sensor_xxxx",
      hospital_: { id: "", name: "Hospital" },
      floor_: { id: "", name: "Floor" },
      room_: { id: "", name: "Room" },
      bed_: { id: "", name: "Bed" }
    };
    if (sensor) {
      const { node_name, hospital_, floor_, room_, bed_ } = sensor;
      placeholder = {
        node_name,
        hospital_: {
          id: hospital_ ? hospital_._id : "",
          name: hospital_ ? hospital_.name : "Hospital"
        },
        floor_: {
          id: floor_ ? floor_._id : "",
          name: floor_ ? `${getOrdinal(floor_.number)} floor` : "Floor"
        },
        room_: {
          id: room_ ? room_._id : "",
          name: room_ ? `Room ${room_.number}` : "Room"
        },
        bed_: {
          id: bed_ ? bed_._id : "",
          name: bed_ ? `${getOrdinal(bed_.number)} bed` : "Bed"
        }
      };
      submitHandler = data => {
        this.onFormSubmit(data, mode, sensor._id);
      };
    }
    const fields = [
      {
        label: "Name of the sensor",
        name: "node_name",
        placeholder: placeholder.node_name,
        component: RenderField,
        type: "text"
      },
      {
        name: "location",
        label: <strong>Patient Location</strong>,
        group: [
          {
            label: "",
            name: "hospital_",
            placeholder: placeholder.hospital_,
            component: RenderSelectGroupField,
            option: this.selectOptionHospital(),
            required: false,
            onChange: e => {
              this.props.fetchFloorsAt(e.target.value);
              if (this.state.modalMode !== "edit") {
                return;
              }
              if (e.target.value === "") {
                const additionalInit = {
                  floor_: "",
                  room_: "",
                  bed_: ""
                };
                this.props.fetchRoomsAt("");
                this.props.fetchBedsAt("");
                const iniData = this.handleInitialize(additionalInit);
                this.props.initialize(iniData);
              }
            }
          },
          {
            label: "",
            name: "floor_",
            placeholder: placeholder.floor_,
            component: RenderSelectGroupField,
            option: this.selectOptionFloor(),
            required: false,
            onChange: e => {
              this.props.fetchRoomsAt(e.target.value);
              if (this.state.modalMode !== "edit") {
                return;
              }
              if (e.target.value === "") {
                const additionalInit = {
                  hospital_: sensor.hospital_,
                  floor_: "",
                  room_: "",
                  bed_: ""
                };
                this.props.fetchBedsAt("");
                const iniData = this.handleInitialize(additionalInit);
                this.props.initialize(iniData);
              }
            }
          },
          {
            label: "",
            name: "room_",
            placeholder: placeholder.room_,
            component: RenderSelectGroupField,
            option: this.selectOptionRoom(),
            required: false,
            onChange: e => {
              this.props.fetchBedsAt(e.target.value);
              if (this.state.modalMode !== "edit") {
                return;
              }
              if (e.target.value === "") {
                const additionalInit = {
                  hospital_: sensor.hospital_,
                  floor_: sensor.floor_,
                  room_: "",
                  bed_: ""
                };
                const iniData = this.handleInitialize(additionalInit);
                this.props.initialize(iniData);
              }
            }
          },
          {
            label: "",
            name: "bed_",
            placeholder: placeholder.bed_,
            component: RenderSelectGroupField,
            option: this.selectOptionBed(),
            required: false
          }
        ]
      }
    ];
    return (
      <Form id={FORMID} onSubmit={handleSubmit(submitHandler)}>
        {RenderFields(fields)}
      </Form>
    );
  };
  renderSensors = (sensors, page, pages) => {
    let i = 0;
    if (!sensors || !sensors.length === 0) {
      return;
    }
    return _.map(sensors, sensor => {
      return [
        PERPAGE * page + ++i,
        sensor.node_name ? sensor.node_name : "Empty",
        sensor.hospital_ ? sensor.hospital_.name : "Not set",
        sensor.room_ ? sensor.room_.number : "Not set",
        sensor.bed_ ? `${getOrdinal(sensor.bed_.number)}` : "Not set",
        <Button
          icon
          fluid
          labelPosition="left"
          color="linkedin"
          onClick={() => {
            this.setState({
              file: null,
              openEditModal: true,
              modalMode: "edit",
              editItem: sensor
            });
            this.props.initialize(this.handleInitialize(sensor));
          }}
        >
          <Icon name="edit" />EDIT
        </Button>,
        <Button
          icon
          fluid
          labelPosition="left"
          color="red"
          onClick={() => {
            this.setState({
              deleteItem: sensor,
              openDeleteModal: true
            });
          }}
        >
          <Icon name="delete" />DELETE
        </Button>
      ];
    });
  };
  renderSelect = items => {
    return _.map(items, item => {
      return (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      );
    });
  };
  render() {
    const { hospitals, sensors, sensors_at } = this.props;
    const {
      editItem,
      deleteItem,
      formResponse,
      modalMode,
      openAddModal,
      openEditModal,
      openLoadModal,
      openDeleteModal
    } = this.state;

    if (!hospitals || !sensors) {
      return <Loading />;
    }
    if (sensors.err) {
      return <ContentErr id="beds" message={sensors.err} />;
    }
    const { page, pages } = sensors_at ? sensors_at : sensors;

    const tableHeadRow = [
      "No.",
      "Name",
      "Hospital",
      "Room",
      "Bed",
      "Edit",
      "Delete"
    ];
    const tableBody = this.renderSensors(
      sensors_at ? sensors_at.sensors : sensors.sensors,
      page,
      pages
    );
    return (
      <div id="sensors">
        <h3 className="text-center">Sensors</h3>
        <Button
          icon
          color="blue"
          labelPosition="right"
          onClick={() => {
            this.setState({
              imagePreviewUrl: null,
              file: null,
              openAddModal: true,
              modalMode: "add"
            });
            this.props.initialize(null);
          }}
        >
          <Icon name="plus" />
          ADD
        </Button>
        <select
          className="ui selection dropdown pull-right"
          onChange={e => {
            this.setState({ currHospital: e.target.value }, () => {
              this.refetchSensors();
            });
          }}
        >
          <option value="">Hospital</option>
          {this.renderSelect(hospitals.hospitals)}
        </select>
        {modalMode === "add" ? (
          <Modal
            open={openAddModal}
            header="Add a Sensor"
            src="none"
            content={this.renderModal(modalMode)}
            formId={FORMID}
            onCancelClick={() => {
              this.setState({ openAddModal: false });
            }}
          />
        ) : null}
        {modalMode === "edit" && editItem ? (
          <Modal
            open={openEditModal}
            header={`Edit ${editItem.node_name}`}
            src="none"
            content={this.renderModal("edit", editItem)}
            formId={FORMID}
            onCancelClick={() => {
              this.setState({ openEditModal: false });
            }}
          />
        ) : null},
        <LoaderModal
          open={openLoadModal}
          response={formResponse}
          onCancelClick={() => {
            this.setState({ openLoadModal: false, formResponse: false });
          }}
        />
        {deleteItem ? (
          <DeleteModal
            open={openDeleteModal}
            response={formResponse}
            name={`${editItem.node_name}`}
            onConfirmClick={() => {
              this.deleteFloor(deleteItem._id);
            }}
            onCancelClick={() => {
              this.setState({ openDeleteModal: false, deleteItem: null });
            }}
          />
        ) : null}
        <Table
          tHead={tableHeadRow}
          tBody={tableBody}
          pages={pages}
          onPageChange={(e, { activePage }) => {
            this.setState({ page: activePage - 1 }, () => {
              this.refetchBeds();
            });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals, floors_at } = state.hospitals;
  const { rooms_at } = state.floors;
  const { beds_at } = state.rooms;
  const { sensors, sensor, sensors_at, add_sensor } = state.sensors;

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
