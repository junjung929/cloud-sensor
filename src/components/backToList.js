import _ from 'lodash'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* export default (props) => {
    return (
        <Link to={`/monitor${props.route[0]}`}>Back to {props.route[1]} List</Link>
    );
} */
class BackToList extends Component {
    onBackToList() {
        return _.map(this.props.route, path => {
            // console.log("--------------------");
            // console.log(path);
            if(!path) {
                return;
            }
            return (
                <Link key={path.route} to={`${path.route}`}><span className="btn btn-default">{`${path.comment}`}</span></Link>
            );
        });
    }
    render() {
            return <div style={{display: 'inline-block'}}>{this.onBackToList()}</div>
    }
}
export  default BackToList;