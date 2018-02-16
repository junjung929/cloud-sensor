import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoadingIndicator from "react-loading-indicator";
import { fetchHospitals } from "../../actions";

import { Content } from "./styles";
import { Card, Image, Icon } from "semantic-ui-react";

const WhiteImg = require("../../assets/white-image.png");

class Hospitals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currItem: ""
    };
  }
  componentDidMount() {
    this.props.fetchHospitals();
    console.log("Monitor page mounted");
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  componentDidUpdate() {}
  onItemClick(currId) {
    const { currItem } = this.state;
    if (currItem !== currId) {
      this.setState({ currItem: currId });
    } else {
      this.setState({ currItem: "" });
    }
  }
  renderHospitals() {
    const { url } = this.props.match;
    const { hospitals } = this.props;
    let i = 0;
    if (hospitals.length === 0) {
      return <div className="text-center">No result...</div>;
    }
    return _.map(hospitals, hospital => {
      if (i < 3) {
        const { currItem } = this.state;
        const imgSrc = hospital.imgSrc ? hospital.imgSrc : String(WhiteImg);
        let toHospital = `${url}/hospital=${hospital._id}#hospital`;
        let spread = "Open";
        if (currItem === hospital._id) {
          toHospital = url;
          spread = "Close";
        }
        const extra = (
          <Link to={toHospital} onClick={() => this.onItemClick(hospital._id)}>
            {spread}
          </Link>
        );

        return (
          <Card key={`card-${hospital._id}`}>
            <Image src={imgSrc} alt={`${hospital.name}-profile-image`} />
            <Card.Content>
              <Card.Header>{hospital.name}</Card.Header>
              <Card.Meta>Hospitals</Card.Meta>
              <Card.Description>
                <p>Address: {hospital.address}</p>
                <p>Tel. {hospital.phone_number}</p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>{extra}</Card.Content>
          </Card>
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
      <Content id="hospitals">
        <h3 className="text-center">
          <Icon name="hospital" />Hospitals
        </h3>
        <Card.Group style={{ justifyContent: "center" }}>
          {this.renderHospitals()}
        </Card.Group>
      </Content>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals } = state.hospitals;
  return { hospitals };
}

export default connect(mapStateToProps, { fetchHospitals })(Hospitals);
