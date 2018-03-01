import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import {
  fetchHospitals,
  addHospital,
  editHospital,
  deleteHospital
} from "../../actions";

import {
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
const FORMID = "hospitalForm";

class Hospitals extends Component {
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
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  componentDidMount() {
    this.props.fetchHospitals(PERPAGE, PAGE);
  }
  refetchHospitals = () => {
    let { page } = this.state;
    this.props.fetchHospitals(PERPAGE, page).then(({ data }) => {
      const { hospitals, pages } = data;
      if (hospitals.length === 0 && pages >= 1) {
        page -= 1;
        this.props.fetchHospitals(PERPAGE, page);
        this.setState({ page });
      }
    });
  };
  handleInitialize = hospital => {
    const { name, address, phone_number } = hospital;
    const iniData = {
      name,
      address,
      phone_number
    };
    this.props.initialize(iniData);
  };
  onPhotoChange = e => {
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
  };

  deleteHospital = id => {
    this.setState({ openLoadModal: true });
    this.props
      .deleteHospital(id)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openDeleteModal: false });
        this.refetchHospitals();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  addHospital = (values, file) => {
    this.props
      .addHospital(values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openAddModal: false });
        this.refetchHospitals();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  editHospital = (id, values, file) => {
    this.props
      .editHospital(id, values, file)
      .then(() => {
        this.setState({ formResponse: "SUCCESS", openEditModal: false });
        this.refetchHospitals();
      })
      .catch(err => {
        this.setState({ formResponse: "FAIL" });
      });
  };
  onFormSubmit = (data, mode, id) => {
    const { file } = this.state;

    //file config
    const newData = new FormData();
    this.setState({ openLoadModal: true });
    
    newData.set("file", file);
    switch (mode) {
      case "edit":
        this.editHospital(id, data, newData);
        break;
      default:
        this.addHospital(data, newData);
    }
  };

  renderModal(mode, hospital) {
    const { handleSubmit } = this.props;

    let submitHandler = data => {
      this.onFormSubmit(data, mode);
    };
    let placeholder = {
      name: "Input a hospital name",
      address: "ex. Vanha maantie 6, espoo",
      phone: "ex. +358 12 345 6789"
    };
    if (hospital) {
      const { name, address, phone_number } = hospital;
      placeholder = {
        name,
        address,
        phone: phone_number
      };
      submitHandler = data => {
        this.onFormSubmit(data, mode, hospital._id);
      };
    }

    const fields = [
      {
        label: "Photo of Hospital",
        name: "thumb_picture",
        component: RenderPhotoField,
        onChange: e => {
          this.onPhotoChange(e);
        }
      },
      {
        label: "Name of Hospital",
        name: "name",
        placeholder: placeholder.name,
        component: RenderField,
        type: "text"
      },
      {
        label: "Address of Hospital",
        name: "address",
        placeholder: placeholder.address,
        component: RenderField,
        type: "text"
      },
      {
        label: "Contact Number of Hospital",
        name: "phone_number",
        placeholder: placeholder.phone,
        component: RenderField,
        type: "tel"
      }
    ];

    return (
      <Form id={FORMID} onSubmit={handleSubmit(submitHandler)}>
        {RenderFields(fields)}
      </Form>
    );
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
          fluid
          labelPosition="left"
          color="linkedin"
          onClick={() => {
            this.setState({
              file: null,
              imagePreviewUrl: null,
              openEditModal: true,
              modalMode: "edit",
              editItem: hospital
            });
            this.handleInitialize(hospital);
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
              deleteItem: hospital,
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
    const { hospitals } = this.props;
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
    
    if (!hospitals) {
      return <Loading />;
    }
    if (hospitals.err) {
      return <ContentErr id="hospitals" message={hospitals.err} />;
    }
    const { pages, page } = hospitals;
    const tableHeadRow = ["No.", "Name", "Address", "Edit", "Delete"];
    const tableBody = this.renderHospitals(hospitals.hospitals, pages, page);
    return (
      <div id="hospitals">
        <h3 className="text-center">Hospitals</h3>
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
            header="Add a Hospital"
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
            header={`Edit ${editItem.name}`}
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
            name={deleteItem.name}
            onConfirmClick={() => {
              this.deleteHospital(deleteItem._id);
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
              this.refetchHospitals();
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

  return {
    hospitals,
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
    addHospital,
    editHospital,
    deleteHospital
  })(Hospitals)
);
