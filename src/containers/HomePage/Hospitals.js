import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHospitals } from "../../actions";

import { Content } from "./styles";
import { Card, Image, Icon, Button, Dimmer, Loader } from "semantic-ui-react";

const WhiteImg = require("../../assets/white-image.png");
const PERPAGE = 3;
const PAGE = 0;
class Hospitals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currItem: ""
    };
  }
  componentDidMount() {
    this.props.fetchHospitals(PERPAGE, PAGE);
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
    const { hospitals } = this.props.hospitals;
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
          <Card key={`card-${hospital._id}`} className="fadeIn">
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
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }
    const { page, pages } = this.props.hospitals;

    return (
      <Content id="hospitals">
        <h3 className="text-center">
          <Icon name="hospital" />Hospitals
        </h3>
        <Card.Group style={{ justifyContent: "center" }}>
          {this.renderHospitals()}
        </Card.Group>
        <Button.Group className="pull-right" style={{ margin: "10px" }}>
          <Button
            icon="angle left"
            disabled={page > 0 ? false : true}
            onClick={() => {
              this.props.fetchHospitals(PERPAGE, page - 1);
            }}
          />
          <Button
            icon="angle right"
            disabled={page < Math.floor(pages) ? false : true}
            onClick={() => {
              this.props.fetchHospitals(PERPAGE, page + 1);
            }}
          />
        </Button.Group>
      </Content>
    );
  }
}

function mapStateToProps(state) {
  const { hospitals } = state.hospitals;
  return { hospitals };
}

export default connect(mapStateToProps, { fetchHospitals })(Hospitals);
