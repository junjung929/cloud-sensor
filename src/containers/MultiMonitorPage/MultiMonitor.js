import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchHospitals, fetchPatients } from "../../actions";
import ReactTags from "react-tag-autocomplete";
import { Sensor } from "../MonitorPage";

class MultiMonitor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      suggestions: []
    };
  }
  componentDidMount() {
    this.props.fetchPatients().then(patients => {
      _.map(patients, patient => {
        this.state.suggestions.push({
          _id: patient._id,
          name: `${patient.first_name} ${patient.last_name}`,
          patient
        });
      });
    });
  }
  handleDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  handleAddition(tag) {
    let isSameTag = false;
    _.map(this.state.tags, oldTag => {
      if (oldTag._id === tag._id) {
        alert("This patient is already seleceted");
        isSameTag = true;
      }
    });
    if (isSameTag) {
      return;
    }
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }
  renderSensors() {
    return _.map(this.state.tags, tag => {
      return <Sensor key={`multi-${tag._id}`} patient={tag.patient} />;
    });
  }
  render() {
    return (
      <div>
        <ReactTags
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete.bind(this)}
          handleAddition={this.handleAddition.bind(this)}
        />
        <div style={{ zIndex: "0" }}>{this.renderSensors()}</div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { hospitals } = state.hospitals;
  const { patients } = state.patients;
  return { hospitals, patients };
}
export default connect(mapStateToProps, { fetchHospitals, fetchPatients })(
  MultiMonitor
);
