import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import { fetchHospitals } from "../../actions";
import styled from "styled-components";

import { Table, Profile } from "../../components";

const Content = styled.div`
  display: flex;
  justify-content: center;
  max-width: 100%;
`;

class Hospitals extends Component {
  componentDidMount() {
    this.props.fetchHospitals();
    console.log("Monitor page mounted");
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  componentDidUpdate() {}
  renderHospitals() {
    const { hospitals } = this.props;
    const { url } = this.props.match;
    let i = 0;
    return _.map(hospitals, hospital => {
      if (i < 3) {
        return (
          <Profile
            key={`prof-${hospital._id}-${i++}`}
            content={hospital}
            link={`${url}/hospital=${hospital._id}`}
          />
        );
      } else {
        return <div key={i++} />;
      }
    });
  }
  render() {
    const { hospitals } = this.props;
    if (!hospitals) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      );
    }
    return (
      <div id="hospitals">
        <h3 className="text-center">Hospitals</h3>
        <Content>{this.renderHospitals()}</Content>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals } = state.hospitals;
  return { hospitals };
}

export default connect(mapStateToProps, { fetchHospitals })(Hospitals);
