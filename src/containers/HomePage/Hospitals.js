import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHospitals } from "../../actions";

import { Profile, NoResult } from "../../components";
import { Content, ContentErr, Loading } from "./Components";

const PERPAGE = 3;
const PAGE = 0;

class Hospitals extends Component {
  componentDidMount() {
    this.props.fetchHospitals(PERPAGE, PAGE);
    console.log("Monitor page mounted");
  }
  renderHospitals = (url, hospitals) => {
    // get current hospital id
    const { pathname } = this.props.location;
    let currItem = pathname.split("hospital=").pop();
    const sliceTill = currItem.search(/\//);
    if (sliceTill > 0) {
      currItem = currItem.slice(0, sliceTill);
    }

    if (!hospitals || hospitals.length === 0) {
      return <NoResult />;
    }
    return _.map(hospitals, hospital => {
      let toHospital = `${url}/hospital=${hospital._id}#floors`;
      let spread = "Open";
      if (currItem === hospital._id) {
        toHospital = url;
        spread = "Close";
      }
      const extra = <Link to={toHospital}>{spread}</Link>;

      return (
        <Profile
          key={`hospital-profile-${hospital._id}`}
          color="blue"
          src={hospital.imgSrc}
          header={hospital.name}
          alt={hospital.name}
          meta="Hospitals"
          description={
            <div>
              <p>Address: {hospital.address}</p>
              <p>Tel. {hospital.phone_number}</p>
            </div>
          }
          extra={extra}
        />
      );
    });
  };
  render() {
    const { hospitals } = this.props;
    const { url } = this.props.match;
    if (!hospitals) {
      return <Loading />;
    }
    if (hospitals.err) {
      return <ContentErr id="hospitals" message={hospitals.err} />;
    }
    const { page, pages } = hospitals;

    return (
      <Content
        id="hospitals"
        icon="hospital"
        header="Hospitals"
        cards={() => this.renderHospitals(url, hospitals.hospitals)}
        url={url}
        page={page}
        pages={pages}
        onLeftClick={() => {
          this.props.fetchHospitals(PERPAGE, page - 1);
        }}
        onRightClick={() => {
          this.props.fetchHospitals(PERPAGE, page + 1);
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  const { hospitals } = state.hospitals;
  return { hospitals };
}

export default connect(mapStateToProps, { fetchHospitals })(Hospitals);
