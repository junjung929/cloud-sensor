import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import {
  fetchHospitals,
  fetchHospital,
  addHospital,
  editHospital,
  deleteHospital,
  uploadFile
} from "actions";
import styled from "styled-components";
import Modal from "react-responsive-modal";

import { Table, Profile } from "components";

const Content = styled.div`
  margin: 0 5% 0 5%;
`;
const ImgPreview = styled.div`
  text-align: center;
  margin: 5px 15px;
  height: 200px;
  max-width: 85vw;
  max-height: 90vh;
  width: 500px;
  background-color: black;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  border-top: 5px solid gray;
  border-bottom: 5px solid gray;
  color: white;
`;
const PreviewImg = styled.img`
  width: auto;
  height: 100%;
`;

class Hospitals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalMode: null,
      open: false,
      currHospital: null,
      file: null,
      imagePreviewUrl: null
    };
    this.renderPhotoField = this.renderPhotoField.bind(this);
    this.onAddFormSubmit = this.onAddFormSubmit.bind(this);
    this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { hospitals } = this.props;
    if (!hospitals) {
      this.props.fetchHospitals();
    }
    // let { _id } = this.props.match.params
    // console.log(_id)
  }

  onPhotoChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({ file, imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }
  formReset() {
    this.props.reset();
  }
  onEditFormSubmit = data => {
    this.props.editHospital(data, this.state.file);
  };
  onAddFormSubmit = data => {
    const { file, onSubmit } = this.state;
    const { addHospital, uploadFile } = this.props;

    //file config
    const dest = `hospitals`;
    let filePath = `${dest}/`;
    const newData = new FormData();

    if (file) {
      let tempData = [];
      filePath += `${file.name}`;
      tempData = Object.assign(data, { file_path: filePath });
      console.log("tempData", tempData);
      data = tempData;
    }
    newData.set("file", file);
    addHospital(data, file).then((err, callback) => {
      if (file) {
        uploadFile(newData, dest, err.data._id).then((err, callback) => {
          console.log("img upload done");
        });
      }
      alert(`${data.name} is added!`);
      this.props.fetchHospitals();
      this.onCloseModal();
      this.formReset();
    });
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
  renderField = field => {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;
    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          className="form-control"
          type="text"
          {...field.input}
          placeholder={field.placeholder}
        />
        <div className="text-help text-danger">{touched ? error : ""}</div>
      </div>
    );
  };
  renderModal(mode) {
    const { hospital, handleSubmit } = this.props;
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let title = "",
      submitHandler = "",
      placeholder = {
        name: "Input a hospital name",
        address: "ex. Vanha maantie 6, espoo",
        phone: "ex. +358 12 345 6789",
        button: "Add"
      };
    switch (mode) {
      case "edit":
        if (!hospital) {
          return <div />;
        }
        title = `${hospital.name} Edit`;
        submitHandler = this.onEditFormSubmit.bind();

        placeholder.name = hospital.name;
        placeholder.address = hospital.address;
        placeholder.phone = hospital.phone_number;
        placeholder.button = "Edit";
        break;
      default:
        title = "Add a hospital";
        submitHandler = this.onAddFormSubmit.bind();
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
            src={hospital.imgSrc}
            alt={`${hospital.name} main photo`}
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
          id="hospitalForm"
          className="form-group"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Field
            label="Photo of Hospital"
            name="thumb_picture"
            component={this.renderPhotoField}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="Name of Hospital"
            name="name"
            placeholder={placeholder.name}
            component={this.renderField}
          />
          <div className="divisionLine" />
          <Field
            label="Address of Hospital"
            name="address"
            placeholder={placeholder.address}
            component={this.renderField}
          />
          <div className="divisionLine" />
          <Field
            label="Contact Number of Hospital"
            name="phone_number"
            placeholder={placeholder.phone}
            component={this.renderField}
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
  onOpenModal(id) {
    this.props.fetchHospital(id);
    this.setState({ open: true, currHospital: id });
  }
  onCloseModal() {
    this.setState({
      open: false,
      currHospital: null,
      file: null,
      imagePreviewUrl: null
    });
    this.formReset();
  }
  deleteHospital = (id, name) => e => {
    onClick: if (
      window.confirm(
        "This behaviour will also affect all information which is childe components of this hospital.\nAre you sure to delete?"
      )
    ) {
      this.props.deleteHospital(id).then((err, callback) => {
        alert(`${name} has been successfully deleted!`);
        this.props.fetchHospitals();
      });
    }
  };
  renderHospitals() {
    const { hospitals } = this.props;
    let i = 0;

    return _.map(hospitals, hospital => {
      return (
        <tr key={hospital._id} id={hospital._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>{hospital.name}</td>
          <td>{hospital.address}</td>
          <td width="10%">
            <div
              className="btn btn-default"
              onClick={() => {
                this.setState({ modalMode: "edit" });
                this.onOpenModal(hospital._id);
              }}
            >
              Open
            </div>
          </td>
          <td width="10%">
            <div
              className="btn btn-danger"
              onClick={this.deleteHospital(hospital._id, hospital.name)}
            >
              Delete
            </div>
          </td>
        </tr>
      );
    });
  }
  render() {
    const { hospitals, hospital } = this.props;
    const { open, currHospital, modalMode } = this.state;
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Address</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    );
    const tableBody = this.renderHospitals();
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
      <div id="hospitals">
        <h3 className="text-center">Hospitals</h3>

        <Content>
          <button
            className="btn btn-primary pull-left"
            onClick={() => {
              this.setState({ modalMode: "add" });
              this.setState({ open: true });
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals, hospital, add_hospital } = state.hospitals;
  return {
    hospitals,
    hospital,
    add_hospital
  };
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {};

  // Validate the inputs from 'values'
  if (!values.name || values.name.length < 3) {
    errors.name = "Enter a name that is at least 3 characters!";
  }
  if (!values.address) {
    errors.address = "Enter an address";
  }
  if (!values.phone) {
    errors.phone = "Enter a phone number ";
  }
  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: `HospitalEditForm`
})(
  connect(mapStateToProps, {
    fetchHospitals,
    fetchHospital,
    editHospital,
    addHospital,
    deleteHospital,
    uploadFile
  })(Hospitals)
);
