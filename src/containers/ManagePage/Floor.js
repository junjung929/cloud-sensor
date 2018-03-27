import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import {
  fetchFloor,
  fetchRoomsAt,
  addRoom,
  editRoom,
  deleteRoom
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

import { Button, Icon, Form } from "semantic-ui-react";

const PERPAGE = 5;
const PAGE = 0;
const FORMID = "roomForm";

class Floor extends Component {
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
    const { floor_id } = this.props.match.params;
    this.props.fetchFloor(floor_id);
    this.props.fetchRoomsAt(floor_id, PERPAGE, PAGE);
  }
  refetchRooms = () => {
    const { floor_id } = this.props.match.params;
    let { page } = this.state;
    this.props.fetchRoomsAt(floor_id, PERPAGE, page).then(({ data }) => {
      const { rooms, pages } = data;
      if (rooms.length === 0 && pages >= 1) {
        page -= 1;
        this.props.fetchRoomsAt(floor_id, PERPAGE, page);
        this.setState({ page });
      }
    });
  };
  handleInitialize = room => {
    const { number, room_class } = room;
    const iniData = {
      number,
      room_class
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

  deleteRoom = roomId => {
    const { floor_id } = this.props.match.params;
    this.setState({ openLoadModal: true });
    this.props
      .deleteRoom(roomId, floor_id)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openDeleteModal: false });
        this.refetchRooms();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  addRoom = (values, file) => {
    this.props
      .addRoom(values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openAddModal: false });
        this.refetchRooms();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  editRoom = (roomId, values, file) => {
    this.props
      .editRoom(roomId, values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openEditModal: false });
        this.refetchRooms();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  onFormSubmit = (data, mode, roomId) => {
    const { floor_id } = this.props.match.params;
    const temp = Object.assign(data, { floor_: floor_id });
    data = temp;

    const { file } = this.state;

    //file config
    const newData = new FormData();
    this.setState({ openLoadModal: true });

    newData.set("file", file);

    newData.set("file", file);
    switch (mode) {
      case "edit":
        this.editRoom(roomId, data, newData);
        break;
      default:
        this.addRoom(data, newData);
    }
  };
  selectOption() {
    const options = [
      { value: "normal", text: "Normal" },
      { value: "important", text: "Important" },
      { value: "vip", text: "VIP" }
    ];
    return _.map(options, option => {
      return (
        <option key={option.value} value={option.value}>
          {option.text} class
        </option>
      );
    });
  }
  renderModal = (mode, room) => {
    const { handleSubmit } = this.props;
    let submitHandler = data => {
      this.onFormSubmit(data, mode);
    };
    let placeholder = {
      number: "Enter an integer number.",
      room_class: "Please select a class for the room."
    };
    if (room) {
      const { number, room_class } = room;
      placeholder = { number, room_class };
      submitHandler = data => {
        this.onFormSubmit(data, mode, room._id);
      };
    }
    const fields = [
      {
        label: "Photo of Room",
        name: "thumb_picture",
        component: RenderPhotoField,
        onChange: e => {
          this.onPhotoChange(e);
        }
      },
      {
        label: "Number of Room",
        name: "number",
        placeholder: placeholder.number,
        component: RenderField,
        type: "number"
      },
      {
        label: "Class of Room",
        name: "room_class",
        placeholder: placeholder.room_class,
        component: RenderSelectField,
        option: this.selectOption()
      }
    ];
    return (
      <Form id={FORMID} onSubmit={handleSubmit(submitHandler)}>
        {RenderFields(fields)}
      </Form>
    );
  };
  renderRooms = (rooms, pages, page) => {
    let i = 0;
    const { hospital_id, floor_id } = this.props.match.params;
    if (!rooms || rooms.length < 1) {
      return;
    }
    return _.map(rooms, room => {
      return [
        PERPAGE * page + ++i,
        <Link
          to={`/manage/hospital=${hospital_id}/floor=${floor_id}/room=${
            room._id
          }`}
        >
          Room No. {room.number}
        </Link>,
        room.room_class,
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
              editItem: room
            });
            this.handleInitialize(room);
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
              deleteItem: room,
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
    const { floor, rooms_at } = this.props;
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

    if (!floor || !rooms_at) {
      return <Loading inline />;
    }
    if (rooms_at.err) {
      return <ContentErr id="rooms" message={rooms_at.err} />;
    }
    const { rooms, page, pages } = rooms_at;
    const tableHeadRow = ["No.", "Name", "Class", "Edit", "Delete"];
    const tableBody = this.renderRooms(rooms, pages, page);
    return (
      <div id="rooms">
        <h3 className="text-center">{getOrdinal(floor.number)} floor</h3>
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
            header="Add a Room"
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
            header={`Edit Room No.${editItem.number}`}
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
              this.refetchRooms();
            });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { floor, rooms_at } = state.floors;
  const { room, add_room, beds_at } = state.rooms;
  return {
    floor,
    rooms_at,
    room,
    add_room,
    beds_at
  };
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.number) {
    errors.number = "Enter an integer number!";
  }
  if (!values.room_class) {
    errors.room_class = "Choose a class!";
  }
  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: `RoomEditForm`
})(
  connect(mapStateToProps, {
    fetchFloor,
    fetchRoomsAt,
    addRoom,
    editRoom,
    deleteRoom
  })(Floor)
);
