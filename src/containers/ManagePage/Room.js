import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import {
  fetchRoom,
  fetchBedsAt,
  fetchFreeSensors,
  addBed,
  editBed,
  deleteBed,
  fetchFreePatients
} from "../../actions";

import {
  getOrdinal,
  Loading,
  ContentErr,
  Table,
  RenderFields,
  RenderField,
  RenderPhotoField,
  RenderSelectField
} from "../../components";
import { ModalContent as Modal, LoaderModal, DeleteModal } from "./Components";

import { Button, Icon, Form, Segment, Header } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;
const FORMID = "bedForm";

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      err: "",
      file: null,
      imagePreviewUrl: null,
      patientItem: null,
      editItem: null,
      deleteItem: null,
      modalMode: null,
      openAddModal: false,
      openEditModal: false,
      openLoadModal: false,
      openDeleteModal: false,
      openPatientModal: false,
      formResponse: false
    };
  }
  componentDidMount() {
    const { room_id } = this.props.match.params;
    this.props.fetchRoom(room_id);
    this.props.fetchBedsAt(room_id, PERPAGE, PAGE);
  }
  refetchBeds = () => {
    const { room_id } = this.props.match.params;
    let { page } = this.state;
    this.props.fetchBedsAt(room_id, PERPAGE, page).then(({ data }) => {
      const { beds, pages } = data;
      if (beds.length === 0 && pages >= 1) {
        page -= 1;
        this.props.fetchBedsAt(room_id, PERPAGE, page);
        this.setState({ page });
      }
    });
  };
  handleInitialize = bed => {
    let { number, _patient, _sensor_node } = bed;
    const iniData = {
      number,
      _patient: _patient ? _patient._id : "",
      _sensor_node: _sensor_node ? _sensor_node._id : ""
    };
    this.props.initialize(iniData);
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
    reader.readAsDataURL(file);
    console.log(file);
  }

  deleteBed = bedId => {
    this.setState({ openLoadModal: true });
    this.props
      .deleteBed(bedId)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openDeleteModal: false });
        this.refetchBeds();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  addBed = (values, file) => {
    this.props
      .addBed(values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openAddModal: false });
        this.refetchBeds();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };

  editBed = (bedId, values, file) => {
    this.props
      .editBed(bedId, values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openEditModal: false });
        this.refetchBeds();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  onFormSubmit = (data, mode, bedId) => {
    const { hospital_id, floor_id, room_id } = this.props.match.params;
    const temp = Object.assign(data, {
      hospital_: hospital_id,
      floor_: floor_id,
      room_: room_id
    });
    data = temp;

    const { file } = this.state;

    //file config
    const newData = new FormData();
    this.setState({ openLoadModal: true });

    newData.set("file", file);
    switch (mode) {
      case "edit":
        this.editBed(bedId, data, newData);
        break;
      default:
        // console.log(data);
        this.addBed(data, newData);
        break;
    }
  };

  selectOption(options) {
    if (!options) {
      return;
    }
    if (options.length < 1) {
      return <option>There is no item available</option>;
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

  renderModal = (mode, bed) => {
    const { handleSubmit } = this.props;
    let submitHandler = data => {
      this.onFormSubmit(data, mode);
    };
    let placeholder = {
      number: "Enter an integer number.",
      _sensor_node: { id: "", name: "Please select a sensor for this bed." },
      _patient: { id: "", name: "Please select a patient for this bed." }
    };
    if (bed) {
      const { number, _sensor_node, _patient } = bed;
      placeholder = {
        number,
        _sensor_node: {
          id: _sensor_node ? _sensor_node._id : "",
          name: _sensor_node
            ? _sensor_node.node_name
            : placeholder._sensor_node.name
        },
        _patient: {
          id: _patient ? _patient._id : "",
          name: _patient
            ? `${_patient.first_name} ${_patient.last_name}`
            : placeholder._patient.name
        }
      };
      submitHandler = data => {
        this.onFormSubmit(data, mode, bed._id);
      };
    }
    const fields = [
      {
        label: "Photo of Bed",
        name: "thumb_picture",
        component: RenderPhotoField,
        onChange: e => {
          this.onPhotoChange(e);
        }
      },
      {
        label: "Number of Bed",
        name: "number",
        placeholder: placeholder.number,
        component: RenderField,
        type: "number"
      },
      {
        label: "Sensor of Bed",
        name: "_sensor_node",
        placeholder: placeholder._sensor_node,
        component: RenderSelectField,
        option: this.selectOption(this.props.free_sensors),
        required: false
      },
      {
        label: "Patient of Bed",
        name: "_patient",
        placeholder: placeholder._patient,
        component: RenderSelectField,
        option: this.selectOption(this.props.free_patients),
        required: false
      }
    ];
    return (
      <Form id={FORMID} onSubmit={handleSubmit(submitHandler)}>
        {RenderFields(fields)}
      </Form>
    );
  };
  renderPatient = patient => {
    if (!patient) {
      return;
    }
    const fullName = `${patient.first_name} ${patient.last_name}`;
    const dateFormat = require("dateformat");
    const birth = dateFormat(patient.birth, "yyyy-mm-dd");
    const enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
    const leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
    return (
      <Segment basic>
        <Header as="h3">{fullName}</Header>
        <p>Address: {patient.address}</p>
        <p>Tel. {patient.phone_number}</p>
        <p>Birthday: {birth}</p>
        <p>Enter Date: {enter_date}</p>
        <p>Leave Date: {leave_date}</p>
        <Button
          as={Link}
          color="blue"
          basic
          labelPosition="right"
          to={`/monitor/patient=${patient._id}`}
          icon
          fluid
          // disabled={ ? false : true}
        >
          <Icon name="computer" />Go to Monitor
        </Button>
      </Segment>
    );
  };
  renderBeds = (beds, pages, page) => {
    let i = 0;
    if (!beds || beds.length < 1) {
      return;
    }
    return _.map(beds, bed => {
      const { number, _sensor_node, _patient } = bed;
      let patientAtBed = "Empty",
        sensorAtBed = "Empty";

      if (_patient) {
        patientAtBed = `${_patient.first_name} ${_patient.last_name}`;
      }
      if (_sensor_node) {
        sensorAtBed = `${_sensor_node.node_name}`;
      }
      return [
        PERPAGE * page + ++i,
        `${getOrdinal(number)} bed`,
        sensorAtBed,
        patientAtBed === "Empty" ? (
          patientAtBed
        ) : (
          <Link
            to="#"
            onClick={() => {
              this.setState({
                openPatientModal: true,
                modalMode: "patient",
                patientItem: _patient
              });
            }}
          >
            {patientAtBed}
          </Link>
        ),
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
              editItem: bed
            });
            this.props.fetchFreeSensors();
            this.props.fetchFreePatients();
            this.handleInitialize(bed);
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
              deleteItem: bed,
              openDeleteModal: true
            });
          }}
        >
          <Icon name="delete" />DELETE
        </Button>
      ];
    });
  };
  render() {
    const { room, beds_at } = this.props;
    const {
      patientItem,
      editItem,
      deleteItem,
      imagePreviewUrl,
      formResponse,
      modalMode,
      openAddModal,
      openEditModal,
      openLoadModal,
      openDeleteModal,
      openPatientModal
    } = this.state;

    if (!room || !beds_at) {
      return <Loading inline />;
    }
    if (beds_at.err) {
      return <ContentErr id="beds" message={beds_at.err} />;
    }
    
    const { beds, page, pages } = beds_at;

    const tableHeadRow = ["No.", "Name", "Sensor", "Patient", "Edit", "Delete"];
    const tableBody = this.renderBeds(beds, page, pages);
    return (
      <div id="beds">
        <h3 className="text-center">Room No. {room.number}</h3>
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
            this.props.fetchFreeSensors();
            this.props.fetchFreePatients();
            this.props.initialize(null);
          }}
        >
          <Icon name="plus" />
          ADD
        </Button>
        {modalMode === "add" ? (
          <Modal
            open={openAddModal}
            header="Add a Bed"
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
            header={`Edit ${getOrdinal(editItem.number)} bed`}
            src={imagePreviewUrl ? imagePreviewUrl : editItem.imgSrc}
            content={this.renderModal("edit", editItem)}
            formId={FORMID}
            onCancelClick={() => {
              this.setState({ openEditModal: false });
            }}
          />
        ) : null},
        {modalMode === "patient" && patientItem ? (
          <Modal
            open={openPatientModal}
            header={`View Information`}
            src={imagePreviewUrl ? imagePreviewUrl : patientItem.imgSrc}
            content={this.renderPatient(patientItem)}
            basic
            onCancelClick={() => {
              this.setState({ openPatientModal: false });
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
            name={`Room No.${deleteItem.number}`}
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
  const { room, beds_at } = state.rooms;
  const { bed, add_bed, edit_bed } = state.beds;
  const { free_patients, patient } = state.patients;
  const { free_sensors } = state.sensors;
  return {
    room,
    beds_at,
    bed,
    add_bed,
    edit_bed,
    patient,
    free_patients,
    free_sensors
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
    fetchFreeSensors,
    addBed,
    editBed,
    deleteBed,
    fetchFreePatients
  })(Room)
);
