import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPatientsSearched } from "../actions";

import styled from "styled-components";

import { Button, Icon, Loader, Dimmer } from "semantic-ui-react";
import { Table } from "../components";

const TableWrapper = styled.div`
  width: 100%;
  padding: 0 3vw 0 3vw;
`;

const PERPAGE = 5;
const PAGE = 0;

class SearchResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchByName: null,
      countResult: 0,
      page: 0
    };
    this.onCountResult = this.onCountResult.bind(this, false);
  }
  componentDidMount() {
    let { searchByName } = this.props.match.params;
    this.props.fetchPatientsSearched(searchByName, PERPAGE, PAGE);
    this.setState({ searchByName });
    this.onCountResult();
  }
  componentDidUpdate() {
    let { searchByName } = this.props.match.params;
    // if new search keyword is different with current keyword
    if (this.state.searchByName !== searchByName) {
      // fetch the data again
      this.props.fetchPatientsSearched(searchByName, PERPAGE, PAGE);
      // set new value as current keyword
      this.setState({ searchByName });
    }
    this.onCountResult();
  }

  onCountResult() {
    if (this.props.patients_searched) {
      const countResult = this.props.patients_searched.length;
      if (countResult !== this.state.countResult) {
        this.setState({ countResult });
      }
    }
  }
  renderPatient = (patients, pages, page) => {
    let i = 0;
    if (!patients || patients.length < 1) {
      return;
    }
    return _.map(patients, patient => {
      const dateFormat = require("dateformat");
      const birth = dateFormat(patient.birth, "yyyy-mm-dd");
      const enter_date = dateFormat(patient.enter_date, "yyyy-mm-dd");
      const leave_date = dateFormat(patient.leave_date, "yyyy-mm-dd");
      return [
        PERPAGE * page + ++i,
        `${patient.first_name} ${patient.last_name}`,
        patient.phone_number,
        birth,
        enter_date,
        leave_date,
        patient.hospital_ ? patient.hospital_.name : "Not set",
        <Button
          as={Link}
          color="blue"
          basic
          to={`/monitor/patient=${patient._id}`}
          icon
          fluid
          title="Go to Monitor"
        >
          <Icon name="computer" />
        </Button>
      ];
    });
  };
  render() {
    const { patients_searched } = this.props;
    const { searchByName } = this.state;
    if (!this.props.patients_searched) {
      return (
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { patients, pages, page } = patients_searched;
    const tableHeadRow = [
      "No.",
      "Name",
      "Tel",
      "Birthday",
      "Enter Date",
      "Leave Date",
      "Hospital",
      ""
    ];
    const tableBody = this.renderPatient(patients, pages, page);
    return (
      <TableWrapper>
        <h3 style={{ marginTop: 0 }} className="text-center">
          Result of '{this.state.searchByName}'
        </h3>
        <Table
          tableHeadRow={tableHeadRow}
          tableBody={tableBody}
          pages={pages}
          onPageChange={(e, { activePage }) => {
            const currpage = activePage;
            setTimeout(() => {
              this.props.fetchPatientsSearched(
                searchByName,
                PERPAGE,
                currpage - 1
              );
            }, 100);
          }}
        />
      </TableWrapper>
    );
  }
}
function mapStateToProps(state) {
  const { patients_searched } = state.patients;
  return { patients_searched };
}

export default connect(mapStateToProps, { fetchPatientsSearched })(
  SearchResultPage
);
