import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class BackToList extends Component {
  onBackToList() {
    return _.map(this.props.route, path => {
      // console.log("--------------------");
      // console.log(path);
      if (!path) {
        return;
      }
      return (
        <Link key={path.route} to={`${path.route}`}>
          <span className="btn btn-default">{`${path.comment}`}</span>
        </Link>
      );
    });
  }
  render() {
    return <div style={{ display: "inline-block" }}>{this.onBackToList()}</div>;
  }
}
export default BackToList;
