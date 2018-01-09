import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import { fetchHospital, fetchFloor } from "actions";
import styled from "styled-components";
import Modal from "react-responsive-modal";

import { Table, Profile } from "components";

const Content = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 5% 0 5%;
`;
const ImgPreview = styled.div`
  text-align: center;
  margin: 5px 15px;
  height: 200px;
  max-width: 85vw;
  max-height: 90vh;
  width: 500px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  border-top: 5px solid gray;
  border-bottom: 5px solid gray;
`;
const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
`;

class Hospital extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      currFloor: null,
      file: null,
      imagePreviewUrl: null
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    console.log(id);
    const { hospital } = this.props;
    if (!hospital) {
      this.props.fetchHospital(id);
    }
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  componentDidUpdate() {}

  onChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({ file, imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }
  onFormSubmit(e) {
    e.preventDefault();
    console.log(this.state.file);
  }
  renderModal() {
    const { floor } = this.props;
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <ImgPreview>
          <PreviewImg src={imagePreviewUrl} />
        </ImgPreview>
      );
    } else {
      $imagePreview = <div />;
    }
    if (!floor) {
      return <div />;
    }

    return (
      <div>
        <h3>{floor.number} Floor Edit</h3>
        <form
          className="form-group"
          onSubmit={() => {
            this.onFormSubmit();
          }}
        >
          <label>Photo: </label>
          <img src={floor.photo} alt={`${floor.name} main photo`} />
          <input
            type="file"
            onChange={e => {
              this.onChange(e);
            }}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <label>Number: </label>
          <input className="form-control" placeholder={floor.number} />
          <div className="divisionLine" />

          <button type="submit" className="btn btn-primary">
            Edit
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
    this.props.fetchFloor(id);
    this.setState({ open: true, currFloor: id });
  }
  onCloseModal() {
    this.setState({
      open: false,
      currFloor: null,
      file: null,
      imagePreviewUrl: null
    });
  }
  renderFloors() {
    const { hospital } = this.props;
    let i = 0;
    if (!hospital) {
      return <div />;
    }
    return _.map(hospital._floor_list, floor => {
      return (
        <tr key={floor._id} id={floor._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>{floor.number} Floor</td>
          <td width="10%">
            <div
              className="btn btn-default"
              onClick={() => {
                this.onOpenModal(floor._id);
              }}
            >
              Open
            </div>
          </td>
          <td width="10%">
            <div
              className="btn btn-danger"
              onClick={() => {
                this.onOpenDeleteHandler();
              }}
            >
              Delete
            </div>
          </td>
        </tr>
      );
    });
  }
  render() {
    const { hospital, floor } = this.props;
    const { open, currfloor } = this.state;
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    );
    const tableBody = this.renderFloors();
    let modalContent = <LoadingIndicator />;
    if (!hospital) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    }
    if (hospital) {
      modalContent = this.renderModal();
    }
    return (
      <div id="floors">
        <h3 className="text-center">{hospital.name}</h3>
        <Content>
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
  return { hospital: state.hospitals.hospital, floor: state.hospitals.floor };
}

export default connect(mapStateToProps, { fetchHospital, fetchFloor })(
  Hospital
);
