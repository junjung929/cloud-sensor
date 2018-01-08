import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'react-loading-indicator';
import { fetchHospitals, fetchHospital } from 'actions';
import styled from 'styled-components'
import Modal from 'react-responsive-modal';

import { Table, Profile } from 'components';

const Content = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 5% 0 5%`;
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
    border-bottom: 5px solid gray;`;
const PreviewImg = styled.img`
    width: 100%;
    height: 100%`;

class Hospitals extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            currHospital: null,
            file: null,
            imagePreviewUrl: null
        }
    }
    componentDidMount() {
        const { hospitals } = this.props;
        if (!hospitals) {
            this.props.fetchHospitals();
        }
        // let { _id } = this.props.match.params
        // console.log(_id)
    }
    componentDidUpdate() {

    }
    onOpenModal(id) {
        this.props.fetchHospital(id);
        this.setState({ open: true, currHospital: id })
    }
    onCloseModal() {
        this.setState({ open: false, currHospital: null, file: null, imagePreviewUrl: null })
    }
    onChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({ file , imagePreviewUrl: reader.result});
        }
        reader.readAsDataURL(file);
    }
    onFormSubmit(e) {
        e.preventDefault();
        console.log(this.state.file)
    }
    onEditModal() {
        const { hospital } = this.props;
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if(imagePreviewUrl) {
            $imagePreview = (<ImgPreview><PreviewImg src={imagePreviewUrl} /></ImgPreview>);
        }
        else {
            $imagePreview = (<div />);
        }
        return (
            <div>
                <h3>{hospital.name} Edit</h3>
                <form className="form-group" onSubmit={() => {this.onFormSubmit()}}>
                    <label>Photo: </label>
                    <img src={hospital.photo} alt={`${hospital.name} main photo`} />
                    <input type="file" onChange={(e) => {this.onChange(e)}} />
                    {$imagePreview}
                    <div className="divisionLine" />
                    <label>Name: </label>
                    <input className="form-control" placeholder={hospital.name} />
                    <div className="divisionLine" />
                    <label>Address: </label>
                    <input className="form-control" placeholder={hospital.address} />
                    <div className="divisionLine" />
                    <label>Contact Number: </label>
                    <input className="form-control" placeholder={hospital.phone_number} />
                    <div className="divisionLine" />
                    <button  type ="submit" className="btn btn-primary">Edit</button>
                    <div className="btn btn-danger" onClick={()=> {this.onCloseModal()}}>Cancel</div>
                </form>
            </div>
        );
    }
    renderHospitals() {
        const { hospitals } = this.props;
        let i = 0;


        return _.map(hospitals, hospital => {
            return (
                <tr key={hospital._id} id={hospital._id}>
                    <th scope="row" width="10%">{++i}</th>
                    <td>{hospital.name}</td>
                    <td>{hospital.address}</td>
                    <td width="10%"><div className="btn btn-default" onClick={() => { this.onOpenModal(hospital._id) }}>Open</div></td>
                    <td width="10%"><div className="btn btn-danger" onClick={() => { this.onOpenDeleteHandler() }}>Delete</div></td>
                </tr>
            );
        })
    }
    render() {
        const { hospitals, hospital } = this.props;
        const { open, currHospital } = this.state;
        const tableHeadRow = (
            <tr>
                <td>No.</td>
                <td>Name</td>
                <td>Address</td>
                <td>Edit</td>
                <td>Delete</td>
            </tr>
        );
        const tableBody = (
            this.renderHospitals()
        );
        let modalContent = <LoadingIndicator />;
        if (!hospitals) {
            return (
                <div className="text-center">
                    <LoadingIndicator />
                </div>
            );
        }
        if (hospital) {
            modalContent = this.onEditModal();
        }
        return (
            <div id="hospitals">
                <h3 className="text-center">Hospitals</h3>
                <Content><Table tableHeadRow={tableHeadRow} tableBody={tableBody} /></Content>
                <Modal open={open} onClose={() => { this.onCloseModal() }}>
                    {modalContent}
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { hospitals: state.hospitals.hospitals, hospital: state.hospitals.hospital };
}

export default connect(mapStateToProps, { fetchHospitals, fetchHospital })(Hospitals);