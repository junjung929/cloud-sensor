import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import LoadingIndicator from "react-loading-indicator";
import {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchRoomsAt,
  fetchBedsAt,
  fetchPatients,
  fetchPatientsAt,
  fetchPatient,
  addPatient,
  editPatient,
  deletePatient
} from "actions";
import Modal from "react-responsive-modal";

import {
  getOrdinal,
  Table,
  RenderField,
  RenderPhotoField,
  RenderSelectGroupField,
  FormReset
} from "components";

import { PreviewImg, Content, ImgPreview } from "./styles";

class Patients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalMode: null,
      open: false,
      updating: false,
      updatingText: null,
      currHospital: "",
      currFloor: null,
      currRoom: null,
      currBed: null,
      currPatient: null,
      file: null,
      imagePreviewUrl: null
    };
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { hospitals } = this.props;
    if (!hospitals) {
      this.props.fetchHospitals();
    }
    this.props.fetchPatients();
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  handleInitialize(additionalInit) {
    const { first_name, last_name, phone_number, address } = this.props.patient;
    const { patient } = this.props;
    let dateFormat = require("dateformat");
    let birth = dateFormat(patient.birth, "yyyy-mm-dd");
    let enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
    let leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
    let iniData = {
      first_name,
      last_name,
      birth,
      enter_date,
      leave_date,
      phone_number,
      address
    };
    if (additionalInit) {
      iniData = Object.assign(iniData, additionalInit);
    }
    console.log(iniData);
    return iniData;
  }
  handleInitializeNull() {
    const iniData = null;
    this.props.initialize(iniData);
  }
  onPhotoChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({ file, imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(file);
    console.log(file);
  }
  deletePatient = patientId => e => {
    if (
      window.confirm(
        "This behaviour will also affect all information which is childe components of this room.\nAre you sure to delete?"
      )
    ) {
      this.setState({ updating: true, updatingText: "initial" });
      this.props.fetchPatient(patientId).then(() => {
        const { patient } = this.props;
        this.props.deletePatient(patientId).then(callback => {
          this.setState({
            updatingText: `Patient ${patient.first_name} ${
              patient.last_name
            } room has been successfully deleted!`
          });
          this.props.fetchPatientsAt(this.state.currHospital);
        });
      });
    }
  };
  addPatient = (values, file) => {
    this.props.addPatient(values, file).then(callback => {
      if (callback.err) {
        return this.setState({ updatingText: `${callback.err}` });
      }
      this.setState({
        updatingText: `Patient ${values.first_name} ${
          values.last_name
        } is added!`
      });
      this.props.fetchPatientsAt(
        this.state.currHospital ? this.state.currHospital : ""
      );
      this.setState({ currHospital: values.hospital_ ? values.hospital_ : "" });
      this.onCloseModal();
    });
  };
  editPatient = (patientId, values, file) => {
    this.props.editPatient(patientId, values, file).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` });
      }
      this.props.fetchPatient(patientId).then(() => {
        this.setState({
          updatingText: `Patient ${values.first_name} ${
            values.last_name
          } is edited!`
        });
        this.props.fetchPatientsAt(this.state.currHospital);
        this.onCloseModal();
      });
    });
  };
  onFormSubmit = (data, mode, patientId) => {
    console.log(data);
    if (!data) {
      return alert("Please enter valid input");
    }
    const { file } = this.state;

    //file config
    const newData = new FormData();

    newData.set("file", file);
    this.setState({ updating: true, updatingText: "initial" });
    switch (mode) {
      case "edit":
        this.editPatient(patientId, data, newData);
        break;
      default:
        this.addPatient(data, newData);
    }
  };
  onOpenModal(id) {
    let iniData = {};
    this.props
      .fetchPatient(id)
      .then(() => {
        const { patient } = this.props;
        const { hospital_, floor_, room_, bed_ } = patient;
        this.props.fetchFloorsAt("");
        this.props.fetchRoomsAt("");
        this.props.fetchBedsAt("");
        iniData = this.handleInitialize();
        if (hospital_) {
          iniData = Object.assign(iniData, { hospital_: hospital_._id });
          return this.props.fetchFloorsAt(hospital_._id).then(() => {
            if (floor_) {
              iniData = Object.assign(iniData, { floor_: floor_._id });
              return this.props.fetchRoomsAt(floor_._id).then(() => {
                if (room_) {
                  iniData = Object.assign(iniData, { room_: room_._id });
                  return this.props.fetchBedsAt(room_._id).then(() => {
                    if (bed_) {
                      iniData = Object.assign(iniData, { bed_: bed_._id });
                    }
                  });
                }
              });
            }
          });
        }
      })
      .then(() => {
        console.log("init", iniData);
        this.props.initialize(iniData);
        return this.setState({ open: true, currSensor: id });
      });
  }
  onCloseModal() {
    this.setState({
      open: false,
      currPatient: null,
      file: null,
      imagePreviewUrl: null
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
    const { patient, handleSubmit } = this.props;
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let title = "",
      submitHandler = "",
      placeholder = {
        first_name: "Enter the first name of a patient.",
        last_name: "Enter the last name of the patient.",
        birth: "Enter the birthday of the patitent.",
        enter_date: "Enter the date when the patient entered to the hospital.",
        leave_date: "Enter the estimated date when the patient will leave.",
        phone_number: "Enter the contact number.",
        address: "Enter the address of the patient.",
        hospital_: { id: "", name: "Hospital" },
        floor_: { id: "", name: "Floor" },
        room_: { id: "", name: "Room" },
        bed_: { id: "", name: "Bed" },
        button: "Add"
      };
    switch (mode) {
      case "edit":
        if (!patient) {
          return <div />;
        }
        title = `${patient.first_name} ${patient.last_name} Edit`;
        submitHandler = data => {
          this.onFormSubmit(data, mode, patient._id);
        };

        const { hospital_, floor_, room_, bed_ } = patient;
        placeholder.hospital_.id = hospital_ ? hospital_._id : "";
        placeholder.hospital_.name = hospital_ ? hospital_.name : "Hospital";
        placeholder.floor_.id = floor_ ? floor_._id : "";
        placeholder.floor_.name = floor_
          ? `${getOrdinal(floor_.number)} floor`
          : "Floor";
        placeholder.room_.id = room_ ? room_._id : "";
        placeholder.room_.name = room_ ? `Room ${room_.number}` : "Room";
        placeholder.bed_.id = bed_ ? bed_._id : "";
        placeholder.bed_.name = bed_ ? `${getOrdinal(bed_.number)} bed` : "Bed";
        placeholder.button = "Edit";
        break;
      default:
        title = "Add a patient";
        submitHandler = data => {
          this.onFormSubmit(data, mode);
        };
    }
    if (imagePreviewUrl) {
      $imagePreview = (
        <ImgPreview>
          <PreviewImg src={imagePreviewUrl} />
        </ImgPreview>
      );
    } else if (mode === "edit") {
      $imagePreview = (
        <ImgPreview>
          <PreviewImg
            src={patient.imgSrc}
            alt={`${patient.first_name} photo`}
          />
        </ImgPreview>
      );
    } else {
      $imagePreview = <div />;
    }

    return (
      <div>
        <h3>{title}</h3>
        <form
          id="patientForm"
          className="form-group"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Field
            label="Photo of Patient"
            name="thumb_picture"
            component={RenderPhotoField}
            onChange={e => {
              this.onPhotoChange(e);
            }}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="First Name of Patient"
            name="first_name"
            type="text"
            placeholder={placeholder.first_name}
            component={RenderField}
          />
          <div className="divisionLine" />
          <Field
            label="Last Name of Patient"
            name="last_name"
            type="text"
            placeholder={placeholder.last_name}
            component={RenderField}
          />
          <div className="divisionLine" />
          <Field
            label="Birthday of Patient"
            name="birth"
            type="date"
            placeholder={placeholder.birth}
            component={RenderField}
          />
          <div className="divisionLine" />
          <Field
            label="Enter date of Patient"
            name="enter_date"
            type="date"
            placeholder={placeholder.enter_date}
            component={RenderField}
          />
          <div className="divisionLine" />
          <Field
            label="Leave date of Patient"
            name="leave_date"
            type="date"
            placeholder={placeholder.leave_date}
            component={RenderField}
          />
          <div className="divisionLine" />
          <Field
            label="Contact number of Patient"
            name="phone_number"
            type="tel"
            placeholder={placeholder.phone_number}
            component={RenderField}
          />
          <div className="divisionLine" />
          <Field
            label="Address of Patient"
            name="address"
            type="text"
            placeholder={placeholder.address}
            component={RenderField}
          />
          <div className="divisionLine" />
          <label>Patient Location</label>
          <div className="divisionLine" />
          <Field
            label=""
            name="hospital_"
            placeholder={placeholder.hospital_}
            component={RenderSelectGroupField}
            option={this.selectOptionHospital()}
            onChange={e => {
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
            }}
          />
          <Field
            label=""
            name="floor_"
            placeholder={placeholder.floor_}
            component={RenderSelectGroupField}
            option={this.selectOptionFloor()}
            onChange={e => {
              this.props.fetchRoomsAt(e.target.value);
              if (this.state.modalMode !== "edit") {
                return;
              }
              if (e.target.value === "") {
                const additionalInit = {
                  hospital_: patient.hospital_,
                  floor_: "",
                  room_: "",
                  bed_: ""
                };
                this.props.fetchBedsAt("");
                const iniData = this.handleInitialize(additionalInit);
                this.props.initialize(iniData);
              }
            }}
          />
          <Field
            label=""
            name="room_"
            placeholder={placeholder.room_}
            component={RenderSelectGroupField}
            option={this.selectOptionRoom()}
            onChange={e => {
              this.props.fetchBedsAt(e.target.value);
              if (this.state.modalMode !== "edit") {
                return;
              }
              if (e.target.value === "") {
                const additionalInit = {
                  hospital_: patient.hospital_,
                  floor_: patient.floor_,
                  room_: "",
                  bed_: ""
                };
                const iniData = this.handleInitialize(additionalInit);
                this.props.initialize(iniData);
              }
            }}
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
  renderPatients() {
    const { patients_at, patients } = this.props;
    let i = 0;
    if (!patients_at) {
      return _.map(patients, patient => {
        return (
          <tr key={patient._id} id={patient._id}>
            <th scope="row" width="10%">
              {++i}
            </th>
            <td>
              {patient.first_name} {patient.last_name}
            </td>
            <td>{patient.hospital_ ? patient.hospital_.name : "Not set"}</td>
            <td>{patient.room_ ? patient.room_.number : "Not set"}</td>
            <td>
              {patient.bed_ ? `${getOrdinal(patient.bed_.number)}` : "Not set"}
            </td>
            <td width="10%">
              <div
                className="btn btn-default"
                onClick={() => {
                  this.setState({ modalMode: "edit" }, () => {
                    this.onOpenModal(patient._id);
                  });
                }}
              >
                Open
              </div>
            </td>
            <td width="10%">
              <div
                className="btn btn-danger"
                onClick={this.deletePatient(patient._id)}
              >
                Delete
              </div>
            </td>
          </tr>
        );
      });
    }
    if (patients_at.length < 1) {
      return (
        <tr>
          <td colSpan="100%">No result...</td>
        </tr>
      );
    }
    return _.map(patients_at, patient => {
      return (
        <tr key={patient._id} id={patient._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>
            {patient.first_name} {patient.last_name}
          </td>
          <td>{patient.hospital_ ? patient.hospital_.name : "Not set"}</td>
          <td>{patient.room_ ? patient.room_.number : "Not set"}</td>
          <td>
            {patient.bed_ ? `${getOrdinal(patient.bed_.number)}` : "Not set"}
          </td>
          <td width="10%">
            <div
              className="btn btn-default"
              onClick={() => {
                this.setState({ modalMode: "edit" }, () => {
                  this.onOpenModal(patient._id);
                });
              }}
            >
              Open
            </div>
          </td>
          <td width="10%">
            <div
              className="btn btn-danger"
              onClick={this.deletePatient(patient._id)}
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
    const { hospitals, patients } = this.props;
    const { open, updating, updatingText, modalMode } = this.state;
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Hospital</td>
        <td>Room</td>
        <td>Bed</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    );
    const tableBody = this.renderPatients();
    let modalContent = <LoadingIndicator />;
    if (!patients) {
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
      <div id="patients">
        <h3 className="text-center">Patients</h3>

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
                this.props.fetchPatientsAt(e.target.value);
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
  const { rooms_at } = state.floors;
  const { beds_at } = state.rooms;
  const { patients, patient, patients_at, add_patient } = state.patients;

  return {
    hospitals,
    patients,
    patient,
    patients_at,
    add_patient,
    floors_at,
    rooms_at,
    beds_at
  };
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.first_name || values.first_name.length < 3) {
    errors.first_name = "Enter a name that is at least 3 characters!";
  }
  if (!values.last_name || values.last_name.length < 3) {
    errors.last_name = "Enter a name that is at least 3 characters!";
  }
  if (!values.birth) {
    errors.birth = "Enter an address";
  }
  if (!values.enter_date) {
    errors.enter_date = "Enter the date when the patient entered";
  }
  if (!values.leave_date) {
    errors.leave_date = "Enter the date when the patient will leave";
  }
  if (!values.phone_number) {
    errors.phone_number = "Enter a phone number ";
  }
  if (!values.address) {
    errors.address = "Enter an address";
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
  form: `PatientEditForm`
})(
  connect(mapStateToProps, {
    fetchHospitals,
    fetchHospital,
    fetchFloorsAt,
    fetchRoomsAt,
    fetchBedsAt,
    fetchPatients,
    fetchPatientsAt,
    fetchPatient,
    addPatient,
    editPatient,
    deletePatient
  })(Patients)
);
