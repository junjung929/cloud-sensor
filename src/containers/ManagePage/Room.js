import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, initialize } from "redux-form";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import {
  fetchRoom,
  fetchBedsAt,
  fetchBed,
  fetchSensors,
  addBed,
  editBed,
  deleteBed,
  addBedAt,
  deleteBedAt,
  fetchPatients,
  fetchPatient
} from "actions";
import Modal from "react-responsive-modal";

import {
  Table,
  Profile,
  getOrdinal,
  RenderField,
  RenderSelectField,
  RenderPhotoField,
  FormReset
} from "components";

import { PreviewImg, Content, ImgPreview, Info } from "./styles";

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalMode: null,
      open: false,
      updating: false,
      updatingText: null,
      currRoom: null,
      currBed: null,
      file: null,
      imagePreviewUrl: null
    };
    this.onPhotoChange = this.onPhotoChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { room, bed } = this.props;
    const { room_id } = this.props.match.params;
    this.setState({ currRoom: room_id });
    this.props.fetchRoom(room_id);
    this.props.fetchBedsAt(room_id);
    this.props.fetchSensors();
    this.props.fetchPatients();
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  componentDidUpdate() {
    const { room_id } = this.props.match.params;
    const { currRoom } = this.state;
    if (currRoom !== room_id) {
      this.props.fetchBedsAt(room_id);
      this.setState({ currRoom: room_id });
    }
  }
  handleInitialize() {
    const { number, _sensor_node } = this.props.bed;
    const iniData = {
      number,
      _sensor_node
    };
    this.props.initialize(iniData);
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

  deleteBed = (bedId, number) => e => {
    const { room_id } = this.props.match.params;
    onClick: if (
      window.confirm(
        "This behaviour will also affect all information which is childe components of this bed.\nAre you sure to delete?"
      )
    ) {
      this.setState({ updating: true, updatingText: "initial" });
      this.props.deleteBed(bedId).then(callback => {
        this.props.deleteBedAt(room_id, { bedId: bedId }).then(() => {
          this.setState({
            updatingText: `${getOrdinal(
              number
            )} bed has been successfully deleted!`
          });
          this.props.fetchBedsAt(room_id);
        });
      });
    }
  };
  addBed = (values, file) => {
    const { room_id } = this.props.match.params;
    // console.log(values);
    this.props
      .addBed(values, file)
      .then((callback) => {
        const { err } = callback; 
        if(err){
          return this.setState({ updatingText: `${err}, please try again.` });
        }
        this.props.addBedAt(room_id, { bedId: callback._id }).then(() => {
          this.setState({ updatingText: `Bed No. ${values.number} is added!` });
          this.props.fetchBedsAt(room_id);
          this.onCloseModal();
        });
      });
  };

  editBed = (bedId, values, file) => {
    const { room_id } = this.props.match.params;
    this.props.editBed(bedId, values, file).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` });
      }

      this.setState({ updatingText: `Bed No. ${values.number} is edited!` });

      this.props.fetchBedsAt(room_id);
      this.onCloseModal();
    });
  };
  onFormSubmit = (data, mode, bedId) => {
    const { room_id } = this.props.match.params;
    console.log(room_id);
    const temp = Object.assign(data, { bedAt: room_id });
    data = temp;
    console.log(data);
    if (!data) {
      return alert("dfa");
    }
    const { file, onSubmit } = this.state;

    //file config
    const newData = new FormData();

    newData.set("file", file);
    this.setState({ updating: true, updatingText: "initial" });
    switch (mode) {
      case "add":
        // console.log(data);
        this.addBed(data, newData);
        break;
      case "edit":
        this.editBed(bedId, data, newData);
        break;
    }
  };

  selectOption(options) {
    if (!options) {
      return;
    }
    return _.map(options, option => {
      const optionName = option.node_name
        ? option.node_name
        : `${option.first_name} ${option.last_name}`;
      return (
        <option key={option._id} value={option._id}>
          {optionName}
        </option>
      );
    });
  }

  renderModal(mode) {
    // console.log(this.props.initialize)
    const { bed, handleSubmit } = this.props;
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let title = "",
      submitHandler = "",
      placeholder = {
        number: "Enter an integer number.",
        _sensor_node: "Please select a sensor for this bed.",
        _patient: "Please select a patient for this bed.",
        button: "Add"
      };
    switch (mode) {
      case "edit":
        if (!bed) {
          return <div />;
        }
        title = `${getOrdinal(bed.number)} bed Edit`;
        submitHandler = data => {
          this.onFormSubmit(data, mode, bed._id);
        };

        placeholder.number = bed.number;
        placeholder.button = "Edit";
        break;
      default:
        title = "Add a bed";
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
          <PreviewImg src={bed.imgSrc} alt={`${bed.number} bed main photo`} />
        </ImgPreview>
      );
    } else {
      $imagePreview = <div />;
    }

    return (
      <div>
        <h3>{title}</h3>
        <form
          id="bedForm"
          className="form-group"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Field
            label="Photo of Bed"
            name="thumb_picture"
            component={RenderPhotoField}
            onChange={e => {
              this.onPhotoChange(e);
            }}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="Number of Bed"
            name="number"
            type="number"
            placeholder={placeholder.number}
            component={RenderField}
          />
          <Field
            label="Sensor of Bed"
            name="_sensor_node"
            placeholder={placeholder._sensor_node}
            component={RenderSelectField}
            option={this.selectOption(this.props.sensors)}
            required={false}
          />
          <Field
            label="Patient of Bed"
            name="_patient"
            placeholder={placeholder._patient}
            component={RenderSelectField}
            option={this.selectOption(this.props.patients)}
            required={false}
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
  onOpenModal(bedId) {
    const { modalMode } = this.state;
    this.props.fetchBed(bedId).then(() => {
      const { bed } = this.props;
      if (bed && modalMode === "edit") {
        this.handleInitialize();
        this.setState({ open: true, currBed: bedId });
      }
    });
  }
  onCloseModal() {
    this.setState({
      open: false,
      currBed: null,
      file: null,
      imagePreviewUrl: null
    });
    FormReset(this.props);
  }
  renderPatient() {
    const { patient } = this.props;

    if (!patient) {
      return <LoadingIndicator />;
    }
    const dateFormat = require("dateformat");
    const birth = dateFormat(patient.birth, "yyyy-mm-dd");
    const enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
    const leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
    return (
      <Info>
        <img
          src={patient.imgSrc}
          className="img-circle"
          style={{ width: 150, height: 150 }}
        />
        <div>
          <h3>
            {patient.first_name} {patient.last_name}
          </h3>
          <p>Address: {patient.address}</p>
          <p>Tel. {patient.phone_number}</p>
          <p>Birthday: {birth}</p>
          <p>Enter Date: {enter_date}</p>
          <p>Leave Date: {leave_date}</p>
          <p>Hospital: {patient.hospital_.name}</p>
          <Link
            className="btn btn-default"
            to={`/monitor/patient=${patient._id}`}
          >
            Go to monitor
          </Link>
        </div>
      </Info>
    );
  }
  renderBeds() {
    const { beds_at, fetchPatient } = this.props;
    let i = 0;
    if (!beds_at || beds_at.length < 1) {
      return (
        <tr>
          <td colSpan="100%">No result...</td>
        </tr>
      );
    }
    return _.map(beds_at, bed => {
      const { _id, number, _sensor_node, _patient } = bed;
      let patientAtBed = "Empty",
        sensorAtBed = "Empty";

      if (_patient) {
        patientAtBed = `${_patient.first_name} ${_patient.last_name}`;
      }
      if (_sensor_node) {
        sensorAtBed = `${_sensor_node.node_name}`;
      }
      return (
        <tr key={bed._id} id={bed._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>{getOrdinal(number)}</td>
          <td>{sensorAtBed}</td>
          <td>
            {patientAtBed === "Empty" ? (
              patientAtBed
            ) : (
              <Link
                to="#"
                onClick={() => {
                  this.setState({ open: true, modalMode: "patient" }, () => {
                    fetchPatient(_patient._id);
                  });
                }}
              >
                {patientAtBed}
              </Link>
            )}
          </td>
          <td width="10%">
            <button
              className="btn btn-default"
              onClick={() => {
                this.setState({ modalMode: "edit" }, () => {
                  this.onOpenModal(_id);
                });
              }}
            >
              Open
            </button>
          </td>
          <td width="10%">
            <button
              className="btn btn-danger"
              onClick={this.deleteBed(bed._id, bed.number)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }
  render() {
    const { room } = this.props;
    const { open, updating, updatingText, currBed, modalMode } = this.state;
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Sensor</td>
        <td>Patient</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    );
    const tableBody = this.renderBeds();
    let modalContent = <LoadingIndicator />;
    if (!room) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    }
    switch (modalMode) {
      case "add":
      case "edit":
        modalContent = this.renderModal(modalMode);
        break;
      case "patient":
        modalContent = this.renderPatient();

        break;
      default:
        modalContent = <LoadingIndicator />;
    }
    return (
      <div id="beds">
        <h3 className="text-center">Room No. {room.number}</h3>

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
  const { room, beds_at } = state.rooms;
  const { bed, add_bed, edit_bed } = state.beds;
  const { patients, patient } = state.patients;
  const { sensors } = state.sensors;
  return {
    room,
    beds_at,
    bed,
    add_bed,
    patient,
    patients,
    sensors
  };
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.number) {
    errors.number = "Enter an integer number!";
  }
  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: `BedEditForm`
})(
  connect(mapStateToProps, {
    fetchRoom,
    fetchBedsAt,
    fetchBed,
    fetchSensors,
    addBed,
    editBed,
    deleteBed,
    addBedAt,
    deleteBedAt,
    fetchPatients,
    fetchPatient
  })(Room)
);
