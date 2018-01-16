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
  deleteBedAt
} from "actions";
import Modal from "react-responsive-modal";

import { Table, Profile, getOrdinal } from "components";

import { PreviewImg, Content, ImgPreview } from "./styles";

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
    this.renderPhotoField = this.renderPhotoField.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { room, bed } = this.props;
    const { room_id } = this.props.match.params;
    this.setState({ currRoom: room_id });
    this.props.fetchRoom(room_id);
    this.props.fetchBedsAt(room_id);
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
    const { number, sensor_node } = this.props.bed;
    const iniData = {
      number,
      sensor_node
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
    console.log(values);
    this.props.addBed(values, file).then(callback => {
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
    const temp = Object.assign(data, { bedAt: room_id });
    data = temp;
    // console.log(data)
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
        console.log(data);
        this.addBed(data, newData);
        break;
      case "edit":
        this.editBed(bedId, data, newData);
        break;
    }
  };
  renderPhotoField(field) {
    return (
      <div>
        <label>{field.label}</label>
        <input
          className="form-control"
          type="file"
          onChange={e => {
            this.onPhotoChange(e);
          }}
        />
      </div>
    );
  }
  renderSelectField = field => {
    const { label, input, placeholder, meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <select
          className="form-control"
          {...input}
          placeholder={placeholder}
          required
        >
          <option value={null}>{placeholder}</option>
          ()
        </select>
        <div className="text-help text-danger">{touched ? error : ""}</div>
      </div>
    );
  };
  renderField = field => {
    const { label, input, type, placeholder, meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input
          className="form-control"
          type={type}
          {...input}
          placeholder={placeholder}
          required
        />
        <div className="text-help text-danger">{touched ? error : ""}</div>
      </div>
    );
  };

  renderModal(mode) {
    // console.log(this.props.initialize)
    const { bed, handleSubmit } = this.props;
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let title = "",
      submitHandler = "",
      placeholder = {
        number: "Enter an integer number.",
        sensor_node: "Please select a sensor for this bed.",
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
            component={this.renderPhotoField}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="Number of Bed"
            name="number"
            type="number"
            placeholder={placeholder.number}
            component={this.renderField}
          />
          <Field
            label="Sensor of Bed"
            name="sensor_node"
            placeholder={placeholder.sensor_node}
            component={this.renderSelectField}
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
    this.formReset();
  }
  formReset() {
    this.props.reset();
  }
  renderBeds() {
    const { beds_at } = this.props;
    let i = 0;
    if (!beds_at) {
      return <tr />;
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
            {patientAtBed}
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
    if (modalMode !== null) {
      modalContent = this.renderModal(modalMode);
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
  return {
    room,
    beds_at,
    bed,
    add_bed
  };
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.number) {
    errors.number = "Enter an integer number!";
  }
  if (!values.sensor_node) {
    errors.sensor_node = "Choose a sensor!";
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
    deleteBedAt
  })(Room)
);
