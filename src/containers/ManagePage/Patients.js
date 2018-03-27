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
  fetchPatients,
  fetchPatientsAt,
  fetchPatient,
  addPatient,
  editPatient,
  deletePatient
} from "../../actions";

import {
  getOrdinal,
  Loading,
  ContentErr,
  Table,
  RenderFields,
  RenderField,
  RenderPhotoField,
  RenderSelectGroupField
} from "../../components";
import { ModalContent as Modal, LoaderModal, DeleteModal } from "./Components";

import { Button, Icon, Form } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;
const FORMID = "patientForm";

class Patients extends Component {
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
      file: null,
      imagePreviewUrl: null,
      editItem: null,
      deleteItem: null,
      modalMode: null,
      openAddModal: false,
      openEditModal: false,
      openLoadModal: false,
      openDeleteModal: false,
      formResponse: false
    };
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    this.props.fetchHospitals();
    this.props.fetchPatients(PERPAGE, PAGE);
  }
  refetchPatients = () => {
    const { currHospital } = this.state;
    let { page } = this.state;
    this.props.fetchPatientsAt(currHospital, PERPAGE, page).then(({ data }) => {
      const { patients, pages } = data;
      if (patients.length === 0 && pages >= 1) {
        page -= 1;
        this.props.fetchPatientsAt(currHospital, PERPAGE, page);
        this.setState({ page });
      }
    });
  };
  handleInitialize = (patient, additionalInit) => {
    const { first_name, last_name, phone_number, address } = patient;
    const dateFormat = require("dateformat");
    const birth = dateFormat(patient.birth, "yyyy-mm-dd");
    const enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
    const leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
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
  };
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
  deletePatient = patientId => {
    this.setState({ openLoadModal: true });
    this.props
      .deletePatient(patientId)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openDeleteModal: false });
        this.refetchPatients();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  addPatient = (values, file) => {
    this.props
      .addPatient(values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openAddModal: false });
        this.refetchPatients();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  editPatient = (patientId, values, file) => {
    this.props
      .editPatient(patientId, values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openEditModal: false });
        this.refetchFloors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  onFormSubmit = (data, mode, patientId) => {
    const { file } = this.state;

    //file config
    const newData = new FormData();

    newData.set("file", file);
    this.setState({ openLoadModal: true });

    switch (mode) {
      case "edit":
        this.editPatient(patientId, data, newData);
        break;
      default:
        this.addPatient(data, newData);
    }
  };
  selectOptionHospital = () => {
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
  };
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
  renderModal = (mode, patient) => {
    const { handleSubmit } = this.props;
    let submitHandler = data => {
      this.onFormSubmit(data, mode);
    };
    let placeholder = {
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
      bed_: { id: "", name: "Bed" }
    };
    if (patient) {
      const {
        first_name,
        last_name,
        birth,
        enter_date,
        leave_date,
        phone_number,
        address,
        hospital_,
        floor_,
        room_,
        bed_
      } = patient;
      placeholder = {
        first_name,
        last_name,
        birth,
        enter_date,
        leave_date,
        phone_number,
        address,
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
        this.onFormSubmit(data, mode, patient._id);
      };
    }
    const fields = [
      {
        label: "Photo of Patient",
        name: "thumb_picture",
        component: RenderPhotoField,
        onChange: e => {
          this.onPhotoChange(e);
        }
      },
      {
        label: "First Name of Patient",
        name: "first_name",
        placeholder: placeholder.first_name,
        component: RenderField,
        type: "text"
      },
      {
        label: "Last Name of Patient",
        name: "last_name",
        placeholder: placeholder.last_name,
        component: RenderField,
        type: "text"
      },
      {
        name: "date",
        group: [
          {
            label: "Birthday of Patient",
            name: "birth",
            placeholder: placeholder.birth,
            component: RenderField,
            type: "date"
          },
          {
            label: "Enter date of Patient",
            name: "enter_date",
            placeholder: placeholder.enter_date,
            component: RenderField,
            type: "date"
          },
          {
            label: "Leave date of Patient",
            name: "leave_date",
            placeholder: placeholder.leave_date,
            component: RenderField,
            type: "date"
          }
        ]
      },
      {
        label: "Contact number of Patient",
        name: "phone_number",
        placeholder: placeholder.phone_number,
        component: RenderField,
        type: "tel"
      },
      {
        label: "Address of Patient",
        name: "address",
        placeholder: placeholder.address,
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
                  hospital_: patient.hospital_,
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
                  hospital_: patient.hospital_,
                  floor_: patient.floor_,
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
  renderPatients = (patients, page, pages) => {
    let i = 0;
    if (!patients || !patients.length === 0) {
      return;
    }
    return _.map(patients, patient => {
      return [
        PERPAGE * page + ++i,
        `${patient.first_name} ${patient.last_name}`,
        patient.hospital_ ? patient.hospital_.name : "Not set",
        patient.room_ ? patient.room_.number : "Not set",
        patient.bed_ ? `${getOrdinal(patient.bed_.number)}` : "Not set",
        <Button
          icon
          fluid
          labelPosition="left"
          color="linkedin"
          onClick={() => {
            this.setState({
              file: null,
              imagePreviewUrl: null,
              openEditModal: true,
              modalMode: "edit",
              editItem: patient
            });
            this.props.initialize(this.handleInitialize(patient));
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
              deleteItem: patient,
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
    const { hospitals, patients, patients_at } = this.props;
    const {
      editItem,
      deleteItem,
      imagePreviewUrl,
      formResponse,
      modalMode,
      openAddModal,
      openEditModal,
      openLoadModal,
      openDeleteModal
    } = this.state;

    if (!hospitals || !patients) {
      return <Loading />;
    }
    if (patients.err) {
      return <ContentErr id="beds" message={patients.err} />;
    }
    const { page, pages } = patients_at ? patients_at : patients;

    const tableHeadRow = [
      "No.",
      "Name",
      "Hospital",
      "Room",
      "Bed",
      "Edit",
      "Delete"
    ];
    const tableBody = this.renderPatients(
      patients_at ? patients_at.patients : patients.patients,
      page,
      pages
    );
    return (
      <div id="patients">
        <h3 className="text-center">Patients</h3>
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
            console.log(e.target.value);
            this.setState({ currHospital: e.target.value }, () => {
              this.refetchPatients();
            });
          }}
        >
          <option value="">Hospital</option>
          {this.renderSelect(hospitals.hospitals)}
        </select>
        {modalMode === "add" ? (
          <Modal
            open={openAddModal}
            header="Add a Patient"
            src={imagePreviewUrl}
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
            header={`Edit ${editItem.first_name} ${editItem.last_name}`}
            src={imagePreviewUrl ? imagePreviewUrl : editItem.imgSrc}
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
            name={`${editItem.first_name} ${editItem.last_name}`}
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
