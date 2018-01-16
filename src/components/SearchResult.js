import _ from 'lodash'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'react-loading-indicator';
import { fetchPatientsSearched } from '../actions';
import styled from 'styled-components';

import { Table, BackToList } from '../components';
const TableWrapper = styled.div`width:100%; padding: 0 3vw 0 3vw`;

class SearchResultPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchByName: null,
            countResult: 0
        }
        this.onCountResult = this.onCountResult.bind(this, false);
    }
    componentDidMount() {
        let { searchByName } = this.props.match.params;
        this.props.fetchPatientsSearched(searchByName);
        this.setState({searchByName});
        this.onCountResult()
    }
    componentDidUpdate(){
        let { searchByName } = this.props.match.params;
        // if new search keyword is different with current keyword
        if(this.state.searchByName != searchByName) {
            // fetch the data again
            this.props.fetchPatientsSearched(searchByName);
            // set new value as current keyword
            this.setState({searchByName});
        }
        this.onCountResult()
    }
    
    onCountResult() {
        if(this.props.patients_searched ){
            let countResult = this.props.patients_searched.length;
            if(countResult != this.state.countResult){
                this.setState({countResult});
            }
        }
    }
    onGoBtn(id) {
        const { match } = this.props;
        switch(match){

        }
        return (
            <a href={`/monitor/patient=${id}`} className="btn btn-default">
                Go
            </a>
        );
    }
    renderPatient() {
        let i = 0;
        if(!this.props.patients_searched) {
            if (i === 0) { return ; }
            return ;
        }
        if (this.props.patients_searched.length === 0) {
            return ;
        }
        return _.map(this.props.patients_searched, patient =>{
            let dateFormat = require('dateformat');
            let birth = dateFormat(patient.birth, "yyyy-mm-dd");
            let enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
            let leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
            return (
                <tr key={patient._id}>
                    <th scope="row">{++i}</th>
                    <td>{patient.first_name} {patient.last_name}</td>
                    <td>{patient.phone_number}</td>
                    <td>{birth}</td>
                    <td>{enter_date}</td>
                    <td>{leave_date}</td>
                    <td>{patient.hospital_.name}</td>
                    <td>
                        {this.onGoBtn(patient._id)}
                    </td>
                </tr>
            );
        });
    }
    render() { 
        if(!this.props.patients_searched) {
            return (
                <div className="text-center">
                    <LoadingIndicator />
                </div>
            );
        }
        let tableHeadRow = (
            <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Tel</th>
                <th>Birthday</th>
                <th>Enter Date</th>
                <th>Leave Date</th>
                <th>Hospital</th>
                <th></th>
            </tr>
        );
        let tableBody = this.renderPatient();
        if (!tableBody || !tableBody[0]) {
            tableBody = (<tr><td colSpan="100%" className="text-center">No result... <BackToList /></td></tr>);
        }
        /* 
        if(this.state.countResult == 0){
            return (<p colSpan="100%" className="text-center">No result... <BackToList /></p>);
        }    */
        return (
            <TableWrapper>
                <BackToList />
                <h3 style={{marginTop:0}} className="text-center">Result of '{this.state.searchByName}'</h3>
                <Table tableHeadRow={tableHeadRow} tableBody={tableBody}/>
            </TableWrapper>
        );
    }
}
function mapStateToProps(state) {
    return { patients_searched: state.patients.patients_searched };
}

export default connect(mapStateToProps, { fetchPatientsSearched })(SearchResultPage);