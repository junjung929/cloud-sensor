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
  deleteHospital
} from "actions";
import Modal from "react-responsive-modal";

import { Table, Profile } from "components";

import { PreviewImg, Content, ImgPreview } from './styles';

class Hospitals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalMode: null,
      open: false,
      updating: false,
      updatingText: null,
      currHospital: null,
      file: null,
      imagePreviewUrl: null
    };
    this.renderPhotoField = this.renderPhotoField.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
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
    console.log(file);
  }
 
  deleteHospital = (id, name) => e => {
    onClick: if (
      window.confirm(
        "This behaviour will also affect all information which is childe components of this hospital.\nAre you sure to delete?"
      )
    ) {
      this.props.deleteHospital(id).then(callback => {
        alert(`${name} has been successfully deleted!`);
        this.props.fetchHospitals();
      });
    }
  };
  addHospital = (values, file) => {
    this.props.addHospital(values, file).then(callback => {
      this.setState({ updatingText: `${values.name} is added!` });
      this.props.fetchHospitals();
      this.onCloseModal();
    });
  };
  editHospital = (id, values, file) => {
    this.props.editHospital(id, values, file).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` });
      }

      this.setState({ updatingText: `${values.name} is edited!` });

      this.props.fetchHospitals();
      this.onCloseModal();
    });
  };
  onFormSubmit = (data, mode, id) => {
    console.log(data)
    if(!data){return alert("dfa")}
    const { file, onSubmit } = this.state;

    //file config
    const newData = new FormData();

    newData.set("file", file);
    this.setState({ updating: true, updatingText: "initial" });
    switch (mode) {
      case "add":
        this.addHospital(data, newData);
        break;
      case "edit":
        this.editHospital(id, data, newData);
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
          required
        />
        <div className="text-help text-danger">{touched ? error : ""}</div>
      </div>
    );
  };
  renderModal(mode) {
    console.log(this.props)
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
        submitHandler = data => {
          this.onFormSubmit(data, mode, hospital._id);
        };

        placeholder.name = hospital.name;
        placeholder.address = hospital.address;
        placeholder.phone = hospital.phone_number;
        placeholder.button = "Edit";
        break;
      default:
        title = "Add a hospital";
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
  formReset() {
    this.props.reset();
  }
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
    const {
      open,
      updating,
      updatingText,
      currHospital,
      modalMode
    } = this.state;
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
        {/* updating alert modal */}
        <Modal
          open={updating}
          onClose={() => {
            this.onCloseModal();
          }}
        >
          <p />
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
  const { hospitals, hospital, add_hospital, edit_hospital } = state.hospitals;
  return {
    hospitals,
    hospital,
    add_hospital,
    // initialValues: 
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
  if (!values.phone_number) {
    errors.phone_number = "Enter a phone number ";
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
    addHospital,
    editHospital,
    deleteHospital
  })(Hospitals)
);
