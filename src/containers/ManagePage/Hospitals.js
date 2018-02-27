import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import {
  fetchHospitals,
  fetchHospital,
  fetchFloorsAt,
  fetchRoomsAt,
  fetchBedsAt,
  deleteFloor,
  deleteRoom,
  deleteBed,
  addHospital,
  editHospital,
  deleteHospital
} from "actions";
import Modal from "react-responsive-modal";

import { RenderField, RenderPhotoField, FormReset } from "../../components";
import { Content } from "./Components";
import { PreviewImg, ImgPreview } from "./styles";
import { Button, Icon } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;

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
      imagePreviewUrl: null,
      page: 0
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  componentDidMount() {
    this.props.fetchHospitals(PERPAGE, PAGE);
  }
  refetchHospitals() {
    const { page } = this.state;
    this.props.fetchHospitals(PERPAGE, page - 1);
  }
  handleInitialize() {
    const { name, address, phone_number } = this.props.hospital;
    const iniData = {
      name,
      address,
      phone_number
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
    let fileValidateRex = /^(image)\/(.+)$/;
    if (!fileValidateRex.exec(file.type)) {
      alert("Please upload only image file!");
      return;
    }
    reader.onloadend = () => {
      this.setState({ file, imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(file);
    console.log(file);
  }

  deleteHospital = (id, name) => e => {
    if (
      window.confirm(
        "This behaviour will also affect all information which is childe components of this hospital.\nAre you sure to delete?"
      )
    ) {
      this.setState({ updating: true, updatingText: "initial" });
      this.props.deleteHospital(id).then(callback => {
        this.setState({
          updatingText: `${name} has been successfully deleted!`
        });
        this.refetchHospitals();
      });
    }
  };
  addHospital = (values, file) => {
    this.props.addHospital(values, file).then(callback => {
      this.setState({ updatingText: `${values.name} is added!` });
      this.refetchHospitals();
      this.onCloseModal();
    });
  };
  editHospital = (id, values, file) => {
    this.props.editHospital(id, values, file).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` });
      }

      this.setState({ updatingText: `${values.name} is edited!` });

      this.refetchHospitals();
      this.onCloseModal();
    });
  };
  onFormSubmit = (data, mode, id) => {
    // console.log(data)
    if (!data) {
      return alert("dfa");
    }
    const { file } = this.state;

    //file config
    const newData = new FormData();

    newData.set("file", file);
    this.setState({ updating: true, updatingText: "initial" });
    switch (mode) {
      case "edit":
        this.editHospital(id, data, newData);
        break;
      default:
        this.addHospital(data, newData);
    }
  };

  renderModal(mode) {
    // console.log(this.props.initialize)
    const { handleSubmit, hospital } = this.props;
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
            component={RenderPhotoField}
            onChange={e => {
              this.onPhotoChange(e);
            }}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="Name of Hospital"
            name="name"
            placeholder={placeholder.name}
            component={RenderField}
            type="text"
          />
          <div className="divisionLine" />
          <Field
            label="Address of Hospital"
            name="address"
            placeholder={placeholder.address}
            component={RenderField}
            type="text"
          />
          <div className="divisionLine" />
          <Field
            label="Contact Number of Hospital"
            name="phone_number"
            placeholder={placeholder.phone}
            component={RenderField}
            type="tel"
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
    const { modalMode } = this.state;
    this.props.fetchHospital(id).then(() => {
      const { hospital } = this.props;
      if (hospital && modalMode === "edit") {
        this.handleInitialize();
        this.setState({ open: true, currHospital: id });
      }
    });
  }
  onCloseModal() {
    this.setState({
      open: false,
      currHospital: null,
      file: null,
      imagePreviewUrl: null
    });
    FormReset(this.props);
  }
  renderHospitals = (hospitals, pages, page) => {
    let i = 0;
    if (!hospitals || hospitals.length < 1) {
      return;
    }
    return _.map(hospitals, hospital => {
      return [
        PERPAGE * page + ++i,
        <Link to={`/manage/hospital=${hospital._id}`}>{hospital.name}</Link>,
        hospital.address,
        <Button
          icon
          title="Open and Edit"
          fluid
          color="linkedin"
          onClick={() => {
            this.setState({ modalMode: "edit" }, () => {
              this.onOpenModal(hospital._id);
            });
          }}
        >
          <Icon name="edit" />
        </Button>,
        <Button
          icon
          fluid
          color="red"
          onClick={this.deleteHospital(hospital._id, hospital.name)}
        >
          <Icon name="delete" />
        </Button>
      ];
    });
  };
  render() {
    const { hospitals } = this.props;
    const { open, updating, updatingText, modalMode } = this.state;

    let modalContent = <LoadingIndicator />;
    if (!hospitals) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    }
    const { pages, page } = hospitals;
    const tableHeadRow = ["No.", "Name", "Address", "Edit", "Delete"];
    const tableBody = this.renderHospitals(hospitals.hospitals, pages, page);
    if (modalMode !== null) {
      modalContent = this.renderModal(modalMode);
    }
    return (
      <div id="hospitals">
        <h3 className="text-center">Hospitals</h3>

        <Content
          tHead={tableHeadRow}
          tBody={tableBody}
          pages={pages}
          onAddClick={() => {
            this.setState({ modalMode: "add", open: true });
            this.handleInitializeNull();
          }}
          onPageChange={(e, { activePage }) => {
            this.setState({ page: activePage });
            setTimeout(() => {
              this.refetchHospitals();
            }, 100);
          }}
        />

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
  const { hospitals, hospital, add_hospital, floors_at } = state.hospitals;
  const { rooms_at } = state.floors;
  const { beds_at } = state.rooms;

  return {
    hospitals,
    hospital,
    add_hospital,
    floors_at,
    rooms_at,
    beds_at
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
    fetchFloorsAt,
    fetchRoomsAt,
    fetchBedsAt,
    deleteRoom,
    deleteBed,
    deleteFloor,
    addHospital,
    editHospital,
    deleteHospital
  })(Hospitals)
);
