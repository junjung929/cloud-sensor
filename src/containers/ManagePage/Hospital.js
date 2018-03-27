import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import {
  fetchHospital,
  fetchFloorsAt,
  addFloor,
  editFloor,
  deleteFloor
} from "../../actions";

import {
  getOrdinal,
  Loading,
  ContentErr,
  Table,
  RenderFields,
  RenderField,
  RenderPhotoField
} from "../../components";
import { ModalContent as Modal, LoaderModal, DeleteModal } from "./Components";

import { Button, Icon, Form } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;
const FORMID = "floorForm";

class Hospital extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
  }
  componentDidMount() {
    const { hospital_id } = this.props.match.params;
    this.props.fetchHospital(hospital_id);
    this.props.fetchFloorsAt(hospital_id, PERPAGE, PAGE);
  }
  refetchFloors = () => {
    const { hospital_id } = this.props.match.params;
    let { page } = this.state;
    this.props.fetchFloorsAt(hospital_id, PERPAGE, page).then(({ data }) => {
      const { floors, pages } = data;
      if (floors.length === 0 && pages >= 1) {
        page -= 1;
        this.props.fetchFloorsAt(hospital_id, PERPAGE, page);
        this.setState({ page });
      }
    });
  };
  handleInitialize = floor => {
    const { number } = floor;
    const iniData = {
      number
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
    reader.onloadend = () => {
      this.setState({ file, imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(file);
    console.log(file);
  }

  deleteFloor = floorId => {
    const { hospital_id } = this.props.match.params;
    this.setState({ openLoadModal: true });
    this.props
      .deleteFloor(floorId, hospital_id)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openDeleteModal: false });
        this.refetchFloors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  addFloor = (values, file) => {
    this.props
      .addFloor(values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openAddModal: false });
        this.refetchFloors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  editFloor = (floorId, values, file) => {
    this.props
      .editFloor(floorId, values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openEditModal: false });
        this.refetchFloors();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  onFormSubmit = (data, mode, floorId) => {
    const { hospital_id } = this.props.match.params;
    const temp = Object.assign(data, { hospital_: hospital_id });
    data = temp;

    const { file } = this.state;

    //file config
    const newData = new FormData();
    this.setState({ openLoadModal: true });

    newData.set("file", file);
    switch (mode) {
      case "edit":
        this.editFloor(floorId, data, newData);
        break;
      default:
        this.addFloor(data, newData);
    }
  };

  renderModal = (mode, floor) => {
    const { handleSubmit } = this.props;
    let submitHandler = data => {
      this.onFormSubmit(data, mode);
    };
    let placeholder = {
      number: "Enter an integer number."
    };
    if (floor) {
      const { number } = floor;
      placeholder = { number };
      submitHandler = data => {
        this.onFormSubmit(data, mode, floor._id);
      };
    }
    const fields = [
      {
        label: "Photo of Floor",
        name: "thumb_picture",
        component: RenderPhotoField,
        onChange: e => {
          this.onPhotoChange(e);
        }
      },
      {
        label: "Name of Floor",
        name: "number",
        placeholder: placeholder.number,
        component: RenderField,
        type: "number"
      }
    ];
    return (
      <Form id={FORMID} onSubmit={handleSubmit(submitHandler)}>
        {RenderFields(fields)}
      </Form>
    );
  };
  renderFloors = (floors, pages, page) => {
    let i = 0;

    if (!floors || floors.length < 1) {
      return;
    }
    return _.map(floors, floor => {
      return [
        PERPAGE * page + ++i,
        <Link to={`/manage/hospital=${floor.hospital_}/floor=${floor._id}`}>
          {getOrdinal(floor.number)} floor
        </Link>,
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
              editItem: floor
            });
            this.handleInitialize(floor);
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
              deleteItem: floor,
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
    const { hospital, floors_at } = this.props;
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

    if (!hospital || !floors_at) {
      return <Loading inline />;
    }
    if (floors_at.err) {
      return <ContentErr id="floors" message={floors_at.err} />;
    }
    const { floors, page, pages } = floors_at;
    const tableHeadRow = ["No.", "Name", "Edit", "Delete"];
    const tableBody = this.renderFloors(floors, pages, page);
    return (
      <div id="floors">
        <h3 className="text-center">{hospital.name}</h3>
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
        {modalMode === "add" ? (
          <Modal
            open={openAddModal}
            header="Add a Floor"
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
            header={`Edit ${getOrdinal(editItem.number)} floor`}
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
            name={`${getOrdinal(deleteItem.number)} floor`}
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
              this.refetchFloors();
            });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { hospital, floors_at } = state.hospitals;
  const { floor, add_floor, rooms_at } = state.floors;
  const { beds_at } = state.rooms;
  return {
    hospital,
    floors_at,
    floor,
    add_floor,
    rooms_at,
    beds_at
  };
}

function validate(values) {
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.number) {
    errors.number = "Enter an integer number";
  }
  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: `FloorEditForm`
})(
  connect(mapStateToProps, {
    fetchHospital,
    fetchFloorsAt,
    addFloor,
    editFloor,
    deleteFloor
  })(Hospital)
);
